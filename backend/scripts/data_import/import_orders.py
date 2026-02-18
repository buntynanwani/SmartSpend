import pandas as pd
import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# -------------------------
# 1️⃣ Load Environment
# -------------------------

load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_PORT = os.getenv("DB_PORT")
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")

engine = create_engine(
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)


print("Starting orders import...")

# -------------------------
# 2️⃣ Build Paths
# -------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
orders_file = os.path.join(BASE_DIR, "raw", "Pedidos-cabecera.csv")
details_file = os.path.join(BASE_DIR, "raw", "Pedidos-detalles.csv")

print("Orders path:", orders_file)
print("Details path:", details_file)

if not os.path.exists(orders_file):
    print(f"❌ Orders file NOT FOUND at: {orders_file}")
    exit()

if not os.path.exists(details_file):
    print(f"❌ Details file NOT FOUND at: {details_file}")
    exit()

# -------------------------
# 3️⃣ Load CSV (Windows encoding)
# -------------------------

orders_df = pd.read_csv(orders_file, sep=";", encoding="cp1252")
details_df = pd.read_csv(details_file, sep=";", encoding="cp1252")

print("✅ CSV files loaded successfully")

print("Orders rows:", len(orders_df))
print("Order items rows:", len(details_df))


# Clean column names
orders_df.columns = orders_df.columns.str.strip().str.upper()
details_df.columns = details_df.columns.str.strip().str.upper()

# -------------------------
# 4️⃣ Clean Orders
# -------------------------

orders_df["TOTAL"] = (
    orders_df["TOTAL"]
    .astype(str)
    .str.replace("€", "", regex=False)
    .str.replace(",", ".", regex=False)
    .astype(float)
)

orders_df["PUNTOS"] = (
    orders_df["PUNTOS"]
    .astype(str)
    .str.replace(",", ".", regex=False)
    .astype(float)
)

orders_df["FECHA"] = pd.to_datetime(
    orders_df["FECHA"],
    dayfirst=True,
    errors="coerce"
)

# -------------------------
# 5️⃣ Insert Orders
# -------------------------

order_id_map = {}

with engine.begin() as conn:
    for _, row in orders_df.iterrows():
        result = conn.execute(
            text("""
                INSERT INTO orders (order_number, order_date, total, points)
                VALUES (:order_number, :order_date, :total, :points)
            """),
            {
                "order_number": row["NUMERO DE PEDIDO"],
                "order_date": row["FECHA"],
                "total": row["TOTAL"],
                "points": row["PUNTOS"]
            }
        )

        order_id_map[row["NUMERO DE PEDIDO"]] = result.lastrowid

print("✅ Orders imported successfully")

# -------------------------
# 6️⃣ Clean Details
# -------------------------

details_df["PRECIO"] = (
    details_df["PRECIO"]
    .astype(str)
    .str.replace("€", "", regex=False)
    .str.replace(",", ".", regex=False)
    .astype(float)
)

# -------------------------
# 7️⃣ Insert Order Items
# -------------------------

with engine.begin() as conn:
    for _, row in details_df.iterrows():

        order_number = row["NUMERO DE PEDIDO"]
        product_reference = row["REFERENCIA PRODUCTO"]

        order_id = order_id_map.get(order_number)
        if not order_id:
            continue

        product_result = conn.execute(
            text("SELECT id FROM products WHERE reference = :ref"),
            {"ref": product_reference}
        ).fetchone()

        if not product_result:
            continue

        product_id = product_result[0]

        conn.execute(
            text("""
                INSERT INTO order_items (order_id, product_id, quantity, price)
                VALUES (:order_id, :product_id, :quantity, :price)
            """),
            {
                "order_id": order_id,
                "product_id": product_id,
                "quantity": row["UNIDADES"],
                "price": row["PRECIO"]
            }
        )

print("✅ Order items imported successfully!")
print("🎉 Import completed successfully!")
