# Guía de Pruebas Unitarias y Reporte de Resultados - Yape BCP Clone

Este documento proporciona una guía completa sobre el entorno de pruebas configurado en el frontend Angular de Yape, los casos de prueba implementados y los pasos para su ejecución.

---

## 🏗️ Entorno de Pruebas

Para garantizar una alta velocidad de ejecución y un desarrollo ágil, se ha implementado un entorno de pruebas moderno basado en **Vitest** y **Happy-DOM**.

### ¿Por qué Vitest en lugar de Karma o Jest?
1. **Velocidad Extrema**: Ejecución nativa multihilo con transformación TypeScript súper veloz vía `esbuild`.
2. **Sin Dependencias de Navegador**: Se utiliza **Happy-DOM** para emular el entorno web (DOM, window, document) en Node.js, evitando levantar instancias de Google Chrome/Chromium locales.
3. **Pruebas de Lógica e Inyección**: Aprovecha `runInInjectionContext` de Angular para probar componentes standalone y servicios con Signals en aislamiento total, sin la sobrecarga del arranque completo del framework (`TestBed.configureTestingModule` pesado).

---

## 🧪 Casos de Prueba Cubiertos (16 Specs)

Se han diseñado 3 suites de pruebas para cubrir el 100% de la lógica de negocio, validaciones y reactividad del frontend:

### 1. `TransferService` (`transfer.service.spec.ts`)
* **`should initialize with default states`**: Verifica que el saldo comience en S/. 150.00, con los datos por defecto de Juan Pérez y 3 transacciones semilla en el historial.
* **`should execute health check`**: Confirma la comunicación HTTP GET correcta hacia `/health`.
* **`should perform transfer and update states when successful (user is source)`**: Simula una transferencia saliente. Verifica la petición POST y comprueba que el saldo disminuya reactivamente en el Signal y la nueva transacción se agregue al historial.
* **`should perform transfer and update states when successful (user is destination)`**: Simula una transferencia entrante. Comprueba que el saldo aumente reactivamente en el Signal.

### 2. `DashboardComponent` (`dashboard.spec.ts`)
* **`should create the component`**: Verifica la instanciación e inyección correcta de dependencias.
* **`should check backend health as healthy on init`**: Valida que al iniciar (`ngOnInit`), se consulte el health check y se marque el estado de la API como saludable (`isApiHealthy = true`).
* **`should check backend health as unhealthy on error`**: Asegura el manejo de fallos si la conexión con el backend REST (M1) se interrumpe (`isApiHealthy = false`).

### 3. `TransferComponent` (`transfer.spec.ts`)
* **`should create the component`**: Verifica la carga del componente.
* **`should initialize form with default values`**: Revisa que los campos de origen, monto por defecto (S/. 50.00) y descripción predeterminada se carguen correctamente.
* **`should validate destination phone number (Peruvian format)`**: Valida estrictamente que el celular de destino sea requerido, tenga exactamente 9 dígitos y comience con el número `9`.
* **`should validate amount is positive and within balance limits`**: Controla que el monto sea mayor a 0, previniendo números negativos y evaluando en tiempo real si el monto excede el saldo actual del usuario (validador `insufficientFunds`).
* **`should select contact from quick options`**: Verifica que al dar clic a un contacto rápido (ej: María, Carlos) se complete el input automáticamente.
* **`should not call transfer if form is invalid`**: Evita llamados al backend si las validaciones fallan.
* **`should prevent self-transfer and set error message`**: Verifica el control de negocio que impide transferir dinero a tu propio número de teléfono.
* **`should perform transfer successfully and reset form`**: Revisa el flujo completo de yapear: envía datos válidos, actualiza el estado de éxito y limpia el formulario.
* **`should handle transfer failure gracefully`**: Simula errores controlados del backend y verifica su correcta visualización en la UI.

---

## 🚀 Ejecución de las Pruebas

Para ejecutar la suite de pruebas unitarias en tu máquina de desarrollo, sigue los siguientes pasos:

### 1. Preparar el Entorno
Asegúrate de que estás en la carpeta del frontend:
```bash
cd yape-frontend
```

Si no has instalado las dependencias aún, hazlo ejecutando:
```bash
npm install
```

### 2. Ejecutar las Pruebas
Ejecuta el script de testing configurado en el `package.json`:
```bash
npm run test
```

### 🛠️ Configuración Interna
El script ejecuta internamente `vitest run`, que realiza una única corrida de validación. 
Si deseas activar el **Modo Observador (Watch Mode)** para desarrollo activo, puedes ejecutar:
```bash
npx vitest
```

---

## 📊 Reporte de Ejecución Exitoso

Al ejecutar las pruebas en consola, obtendrás el siguiente reporte detallado:

```text
> yape-frontend@0.0.0 test
> vitest run

 RUN  v4.1.7 C:/Maestria/aws-rest-grpc/yape-frontend

 ✓ src/app/services/transfer.service.spec.ts (4 tests) 31ms
 ✓ src/app/pages/dashboard/dashboard.spec.ts (3 tests) 30ms
 ✓ src/app/pages/transfer/transfer.spec.ts (9 tests) 45ms

 Test Files  3 passed (3)
      Tests  16 passed (16)
   Start at  23:00:49
   Duration  2.77s (transform 487ms, setup 619ms, import 2.87s, tests 106ms, environment 2.78s)
```

> [!TIP]
> **Pruebas Continuas (CI/CD)**: Puedes integrar este comando `npm run test` en tu pipeline de GitHub Actions o Jenkins para bloquear despliegues en caso de que alguna regla de negocio del frontend sea alterada.
