# Documentación de Pruebas - Yape BCP Clone

Esta guía proporciona instrucciones detalladas sobre cómo ejecutar el entorno de pruebas de la aplicación, verificando la salud del proyecto.

## Arquitectura de Testing

El proyecto se divide en dos tipos de pruebas principales para el frontend:

1. **Pruebas Unitarias (Vitest + Happy-DOM)**:
   Aseguran que la lógica de los servicios, señales (Signals) y validaciones de formularios funcionen correctamente en aislamiento. Se usa `esbuild` y `runInInjectionContext` para máxima velocidad.

2. **Pruebas End-to-End (Playwright)**:
   Simulan las interacciones reales del usuario en el navegador Google Chrome. Prueban la navegación, el renderizado de la UI, el formateo de números/fechas y el comportamiento de la interfaz cuando el backend está fuera de línea (`M1 Offline`).

---

## 🚀 Pasos para ejecutar el Testing

### 1. Preparar el Entorno

Abre una terminal y dirígete al directorio del frontend:
```bash
cd yape-frontend
```

Instala las dependencias (si no lo has hecho):
```bash
npm install
```

### 2. Ejecución de Pruebas Unitarias (Vitest)

Estas pruebas son extremadamente rápidas y validan la lógica central.

* **Comando para una ejecución única**:
  ```bash
  npm run test
  ```
* **Comando para el modo observador (Watch Mode) durante desarrollo**:
  ```bash
  npx vitest
  ```

*Deberías ver que los 16 tests distribuidos en 3 archivos pasan de forma exitosa (en ~3 segundos).*

### 3. Ejecución de Pruebas E2E (Playwright)

Estas pruebas levantarán un servidor web local interno (puerto 4201) y simularán un navegador real en modo "headless".

* **Comando para ejecutar las pruebas E2E**:
  ```bash
  npx playwright test
  ```

* **Comando para visualizar el reporte HTML generado**:
  (En caso de errores, Playwright guarda capturas de pantalla y un informe en la carpeta `playwright-report` o `test-results`).
  ```bash
  npx playwright show-report
  ```

> **Nota importante sobre el Backend**:
> Las pruebas E2E de Playwright han sido diseñadas para funcionar de manera resiliente. Si los servicios REST (`m1-rest`) o gRPC (`m2-grpc`) no están activos, el indicador de salud de la interfaz mostrará **`M1 Offline`** y la suite de pruebas validará de todos modos la navegación, el control de formularios y el flujo del usuario.

---

## ✅ Resumen de Casos de Prueba Principales

* **Formatos y Localización**: Validación de saldos renderizados en formato peruano (`S/.`) y las fechas en español gracias a la configuración de `LOCALE_ID`.
* **Health Check API**: Verificación dinámica del estado del servicio.
* **Control de Transferencias**:
  * Prevención de transferencias al mismo número.
  * Control estricto del formato del teléfono celular (9 dígitos comenzando con 9).
  * Validación de fondos insuficientes en tiempo real frente al saldo actual.
* **Journey de Navegación**: Se valida que los redirects en el shell global conduzcan correctamente a la pestaña de `/dashboard` o `/yapear`.
