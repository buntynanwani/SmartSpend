# **SmartSpend – Plataforma de Inteligencia de Gastos Personales**

## **1\. Declaración del Problema**

El seguimiento de los gastos del hogar suele estar fragmentado y carece de profundidad analítica. La mayoría de las aplicaciones bancarias muestran el gasto mensual total, pero no ofrecen:

* Seguimiento de precios a nivel de artículo en diferentes tiendas.  
* Análisis comparativo de proveedores.  
* Separación de gastos por usuario dentro de un mismo hogar.  
* Información de costos basada en categorías.  
* Tableros analíticos estructurados.  
* Pronósticos de gasto predictivos.

### **Desafíos Principales**

* **a) Seguimiento de precios por artículo:** Los usuarios no pueden monitorear cómo fluctúan los precios de productos específicos en diferentes tiendas a lo largo del tiempo (ej. el precio de los plátanos en distintos supermercados).  
* **b) Análisis multiusuario en el hogar:** En hogares compartidos, es difícil analizar el comportamiento de gasto individual (ej. Mamá vs. Bunty).  
* **c) Transparencia por categorías:** Las categorías de alto costo como servicios públicos, fisioterapia o suplementos a menudo se subestiman sin un desglose estructurado.  
* **d) Generación de Insights:** Los usuarios carecen de métricas estructuradas como:  
  * Gasto mensual total.  
  * Categoría más costosa.  
  * Costo promedio semanal de compras.  
  * Distribución de gastos por tienda.  
  * Análisis de compras a nivel de cesta/carrito.

## **2\. Solución Propuesta**

SmartSpend es un sistema de inteligencia de gastos *full-stack* que:

* Recopila datos de gastos estructurados a través de una interfaz web.  
* Almacena los datos en una base de datos SQL relacional normalizada.  
* Expone los datos para análisis avanzado en Power BI.  
* Permite futuros pronósticos basados en IA y detección de anomalías.

## **3\. Descripción General de la Arquitectura**

### **Flujo de Datos**

Usuario → Frontend en React → Backend en FastAPI → Base de Datos MySQL → Tablero Power BI

### **Frontend**

* React (JavaScript).  
* Formulario dinámico de compra multiartículo.  
* Funcionalidad de editar y eliminar.  
* Cálculo de totales en tiempo real.  
* Gestión de estados limpia.

### **Backend**

* FastAPI (Python).  
* Diseño de API RESTful.  
* Implementación completa de CRUD.  
* Validación de esquemas con Pydantic v2.  
* Modelos de petición/respuesta anidados.  
* Transformación de datos estructurados.

### **Base de Datos**

* MySQL.  
* SQLAlchemy ORM.  
* Esquema relacional totalmente normalizado.  
* Relaciones de claves foráneas.  
* Estructura de cabecera de compra \+ artículos de compra.

### **Capa de Analítica**

* Power BI conectado directamente a MySQL.  
* Diseñado para modelado de hechos/dimensiones.  
* Tableros impulsados por KPIs.

## **4\. Modelo de Datos Refinado (Evolución de la Implementación)**

Durante la implementación, el modelo inicial de transacciones planas se refactorizó en un diseño relacional normalizado para soportar analítica escalable.

### **Tablas Principales**

* Usuarios (*Users*)  
* Tiendas (*Shops*)  
* Productos (*Products*)  
* Compras (*Purchases* \- datos a nivel de cabecera)  
* Artículos de Compra (*PurchaseItems* \- datos a nivel de línea)

### **Estructura de Diseño**

Cada **Compra** incluye: Usuario, Tienda, Fecha y Monto total. Cada **Artículo de Compra** incluye: Producto, Cantidad, Precio unitario y Subtotal.

Esta estructura permite:

* Análisis de cestas multiartículo.  
* Seguimiento de la evolución de precios por artículo.  
* Agregación precisa de totales.  
* Modelado de hechos limpio en Power BI.  
* Preparación para pronósticos futuros.

## **5\. Definición del MVP (Producto Mínimo Viable)**

El MVP se centra en entregar un flujo de datos funcional y un backend listo para la analítica.

### **Características Principales Implementadas**

✔ Crear Usuarios. ✔ Crear Tiendas. ✔ Crear Productos. ✔ Registrar compras que contienen múltiples artículos. ✔ Cálculo automático de subtotal por artículo. ✔ Cálculo automático de total por compra. ✔ Editar y eliminar compras. ✔ Seguimiento de fechas persistente. ✔ Almacenamiento relacional estructurado.

### **Analítica (Fase MVP)**

✔ Tablero de Power BI que incluye:

* Gasto mensual total.  
* Comparativa de usuarios.  
* Desglose por categorías.  
* Categoría más costosa.  
* Costo promedio semanal de compras.  
* Distribución de gasto por tienda.  
* Evolución del precio de los artículos.

## **6\. Justificación de la Tecnología**

* **React:** Ligero y adecuado para interfaces de entrada de datos estructurados.  
* **FastAPI:** Framework de Python de alto rendimiento ideal para arquitecturas basadas en API e integración futura de IA.  
* **SQLAlchemy:** Permite un modelado ORM limpio y una arquitectura relacional escalable.  
* **MySQL:** Base de datos relacional necesaria para consultas analíticas estructuradas e integración de BI.  
* **Pydantic v2:** Garantiza una validación estricta de datos y contratos de API estructurados.  
* **Power BI:** Herramienta de BI estándar de la industria alineada con flujos de trabajo de análisis e ingeniería de datos.  
* **Python:** Facilita la transición hacia el aprendizaje automático, pronósticos y detección de anomalías.

## **7\. Fuente y Procesamiento de Datos**

### **Fuente**

* Recibos domésticos reales.  
* Entrada manual de datos estructurados.

### **Procesamiento de Datos**

* Validación en el Backend.  
* Formato de fecha consistente.  
* Relaciones de claves foráneas estructuradas.  
* Lógica de cálculo automática.

**Futuras mejoras:** Pronósticos de series temporales (Prophet, Scikit-learn), modelos de detección de anomalías e ingesta de recibos basada en OCR.

## **8\. Fases de Desarrollo**

* **Fase 1 – Base de Datos (Completada):** Diseño del esquema, modelado ER, backend en FastAPI, integración de SQLAlchemy y validación de esquemas.  
* **Fase 2 – Integración Frontend (Completada):** Diseño de formularios en React, soporte para compras multiartículo, funcionalidad editar/eliminar y sincronización de API.  
* **Fase 3 – Inteligencia de Negocios (Siguiente):** Conexión a Power BI, diseño de tableros KPI e insights analíticos.  
* **Fase 4 – Capa Predictiva (Alcance Futuro):** Pronósticos de series temporales, modelado predictivo a nivel de categoría, detección de anomalías y autenticación.

## **9\. Riesgos Técnicos y Mitigación**

* **Riesgo:** Calidad de datos por entrada manual → **Mitigación:** Validación en backend y cumplimiento de esquemas.  
* **Riesgo:** Sobrecomplicar la fase de IA → **Mitigación:** Priorizar la analítica descriptiva antes que el modelado predictivo.  
* **Riesgo:** Problemas de conexión con Power BI → **Mitigación:** Uso de esquema relacional estructurado para compatibilidad.

## **10\. Valor Estratégico**

SmartSpend no es solo un gestor de gastos. Es:

1. Un sistema de datos relacional estructurado.  
2. Un mini flujo (*pipeline*) de ingeniería de datos.  
3. Una arquitectura lista para analítica.  
4. Una base para el modelado predictivo.

Demuestra capacidad en desarrollo *full-stack*, modelado de bases de datos relacionales, diseño de contratos de API e integración de inteligencia de negocios.

