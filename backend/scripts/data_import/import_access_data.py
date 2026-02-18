import pandas as pd
import os
import datetime  # Updated to avoid name shadowing
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# -------------------------
# 1️⃣ Load Environment
# -------------------------
load_dotenv()

DB_USER = os.getenv("DB_USER", "root")
DB_PASS = os.getenv("DB_PASS") or os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME")

if not DB_PASS:
    print("❌ ERROR: Database password not found! Check your .env file.")
    exit()

print(f"Connecting to {DB_NAME} as {DB_USER} on {DB_HOST}...")

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL, echo=False)

# -------------------------
# 2️⃣ Helper Functions
# -------------------------
def clean_price_column(series):
    return (
        series.astype(str)
        .str.replace(",", ".", regex=False)
        .str.replace(r'[^0-9.\-]', '', regex=True)
        .replace('', '0')
        .astype(float)
    )

# -------------------------
# 3️⃣ Build Dynamic Paths
# -------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
products_file = os.path.join(BASE_DIR, "raw", "Productos.csv")
orders_file = os.path.join(BASE_DIR, "raw", "Pedidos-cabecera.csv")
details_file = os.path.join(BASE_DIR, "raw", "Pedidos-detalles.csv")

# -------------------------
# 4️⃣ Step 1: Import/Update Products
# -------------------------
def import_products():
    print("\n--- Starting Products Import ---")
    if not os.path.exists(products_file):
        print(f"❌ Products file NOT FOUND at: {products_file}")
        return

    try:
        # Load CSV
        df = pd.read_csv(products_file, sep=";", encoding="cp1252")
        
        # Rename columns
        df = df.rename(columns={
            "Refencia": "reference",
            "Descripcion": "name",
            "Marca": "brand"
        })
        
        # 🔥 THE CRITICAL FIX: Remove rows where 'name' is empty or NaN
        df = df.dropna(subset=["name"])
        df = df[df["name"].str.strip() != ""]

        df_mysql = pd.DataFrame()
        df_mysql["reference"] = df["reference"].astype(str).str.strip()
        df_mysql["name"] = df["name"].astype(str).str.strip()
        df_mysql["category"] = df["brand"].fillna("General")
        df_mysql["unit_type"] = "unit"

        with engine.begin() as conn:
            conn.execute(text("SET FOREIGN_KEY_CHECKS = 0;"))
            conn.execute(text("TRUNCATE TABLE products;"))
            # Use 'conn' directly to maintain the FK disable state
            df_mysql.to_sql("products", conn, if_exists="append", index=False)
            conn.execute(text("SET FOREIGN_KEY_CHECKS = 1;"))
            
        print(f"✅ Successfully refreshed {len(df_mysql)} products with references.")
    except Exception as e:
        print(f"❌ Product import failed: {e}")

# -------------------------
# 5️⃣ Step 2: Import Orders & Items
# -------------------------
def import_orders():
    print("\n--- Starting Orders & Items Import ---")
    if not os.path.exists(orders_file) or not os.path.exists(details_file):
        return

    try:
        orders_df = pd.read_csv(orders_file, sep=";", encoding="cp1252")
        details_df = pd.read_csv(details_file, sep=";", encoding="cp1252")
        
        orders_df.columns = orders_df.columns.str.strip().str.upper()
        details_df.columns = details_df.columns.str.strip().str.upper()

        orders_df["TOTAL"] = clean_price_column(orders_df["TOTAL"])
        orders_df["PUNTOS"] = clean_price_column(orders_df["PUNTOS"])
        details_df["PRECIO"] = clean_price_column(details_df["PRECIO"])
        
        # Format Dates
        orders_df["FECHA"] = pd.to_datetime(orders_df["FECHA"], dayfirst=True, errors="coerce")

        order_id_map = {}

        with engine.begin() as conn:
            conn.execute(text("SET FOREIGN_KEY_CHECKS = 0;"))
            conn.execute(text("TRUNCATE TABLE order_items;"))
            conn.execute(text("TRUNCATE TABLE orders;"))
            conn.execute(text("SET FOREIGN_KEY_CHECKS = 1;"))

            for _, row in orders_df.iterrows():
                # skip rows with invalid dates
                if pd.isna(row["FECHA"]): continue
                
                res = conn.execute(
                    text("INSERT INTO orders (order_number, order_date, total, points) VALUES (:num, :date, :tot, :pts)"),
                    {"num": str(row["NUMERO DE PEDIDO"]).strip(), "date": row["FECHA"], "tot": row["TOTAL"], "pts": row["PUNTOS"]}
                )
                order_id_map[str(row["NUMERO DE PEDIDO"]).strip()] = res.lastrowid
            
            print(f"✅ {len(order_id_map)} Orders imported.")

            success_items = 0
            for _, row in details_df.iterrows():
                ord_num = str(row["NUMERO DE PEDIDO"]).strip()
                prod_ref = str(row["REFERENCIA PRODUCTO"]).strip()

                order_id = order_id_map.get(ord_num)
                prod_res = conn.execute(
                    text("SELECT id FROM products WHERE reference = :ref"),
                    {"ref": prod_ref}
                ).fetchone()

                if order_id and prod_res:
                    conn.execute(
                        text("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (:oid, :pid, :q, :p)"),
                        {"oid": order_id, "pid": prod_res[0], "q": row["UNIDADES"], "p": row["PRECIO"]}
                    )
                    success_items += 1

            print(f"✅ {success_items} Order items imported.")

    except Exception as e:
        print(f"❌ Orders import failed: {e}")

if __name__ == "__main__":
    import_products()
    import_orders()
    print("\n🎉 Process finished!")