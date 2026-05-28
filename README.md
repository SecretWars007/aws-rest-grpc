# 📱 Yape BCP Clone - Microservicios REST + gRPC (Clean Architecture)

Este repositorio contiene una implementación completa y robusta de un clon de la pasarela de pagos móviles **Yape** (BCP Perú). El proyecto está diseñado desde cero aplicando de forma estricta los principios **SOLID** y **Clean Architecture** (Arquitectura Limpia), implementado en **TypeScript** con resolución de módulos moderna **NodeNext (ESM)** y orquestado mediante **Docker Compose** y **Kubernetes**.

---

## 🏗️ Arquitectura del Sistema

El sistema se compone de dos microservicios altamente desacoplados con responsabilidades únicas:

```text
                                [ Red Interna / Kubernetes ]
                                              │
    [Cliente]                                 ▼                       [Memoria]
    ─────────           (REST)          ┌───────────┐    (gRPC)     ┌───────────┐
     Usuario   ───────────────────────> │  M1-REST  │ ────────────> │  M2-gRPC  │
    (Postman/  (D. Compose: :3001)      │ (Gateway) │  (:50051)     │  (Core)   │
      cURL)    (Kubernetes: :32001)     └───────────┘               └───────────┘
                                              │                           │
                                              ▼                           ▼
                                        [Puerto Host]               [Puerto Host]
                                            :3001                       :50051
```

1. **M1 (Gateway REST - `m1-rest`)**:
   * Actúa como el punto de entrada para los clientes.
   * Recibe solicitudes HTTP REST en formato JSON.
   * Valida la estructura sintáctica de los datos (formatos de teléfonos peruanos, montos positivos).
   * Actúa como cliente gRPC consumiendo el contrato de M2.
   * Mapea códigos de error de red o negocio de gRPC a códigos estándar HTTP (e.g. `400 Bad Request`, `503 Service Unavailable`).

2. **M2 (Core de Transacciones - `m2-grpc`)**:
   * Contiene el núcleo de negocio puro y las reglas de dominio.
   * Expone un servidor gRPC implementando el contrato definido en `proto/wallet.proto`.
   * Realiza validaciones semánticas (existencia de billeteras, suficiencia de fondos).
   * Registra transacciones y actualiza los saldos (simulado con repositorio en memoria inyectado).

---

## 📊 Semillas de Prueba (Seed Data)

El sistema se inicializa con los siguientes usuarios de prueba para facilitar la validación inmediata:

| Celular (ID de Billetera) | Propietario       | Saldo Inicial (S/.) |
| :----------------------- | :---------------- | :------------------ |
| **`987654321`**          | Juan Pérez        | S/. 150.00          |
| **`912345678`**          | María Rodríguez   | S/. 10.00           |
| **`999888777`**          | Carlos Mendoza    | S/. 500.00          |

---

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu máquina local:
* **Node.js** (Versión 18 o superior)
* **Docker** y **Docker Compose**
* **kubectl** (opcional, para despliegue en Kubernetes)
* **Git**

---

## 🐳 1. Despliegue con Docker Compose (Rápido)

Sigue estos pasos para compilar y arrancar el entorno usando Docker Compose de forma local:

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/aws-rest-grpc.git
cd aws-rest-grpc

# 2. Instalar dependencias en el host (opcional, para soporte del IDE)
npm install

# 3. Levantar los contenedores en segundo plano
docker-compose up -d --build
```
Deberías ver listados los siguientes contenedores activos con `docker ps`:
- **`yape-m1-rest`**: Mapeado al puerto de tu host **`3001`**.
- **`yape-m2-grpc`**: Mapeado al puerto de tu host **`50051`**.

---

## ☸️ 2. Despliegue en Kubernetes (Orquestación Empresarial)

Hemos diseñado manifiestos declarativos de Kubernetes en el directorio `k8s/` que proporcionan alta disponibilidad (2 réplicas por microservicio), aislamiento lógico y balanceo de carga interno.

### Paso A: Construir Imágenes Docker Locales
Construye las imágenes dentro del host para que Kubernetes pueda consumirlas:
```bash
docker build -t aws-rest-grpc-m2-grpc:latest -f m2-grpc/Dockerfile .
docker build -t aws-rest-grpc-m1-rest:latest -f m1-rest/Dockerfile .
```

### Paso B: Cargar Imágenes en tu Entorno de Kubernetes Local (Si aplica)
Dependiendo de qué clúster local estés utilizando, ejecuta el comando correspondiente para inyectar las imágenes compiladas:
* **Docker Desktop**: *No requiere pasos adicionales*, utiliza el daemon de docker nativo.
* **Minikube**:
  ```bash
  minikube image load aws-rest-grpc-m2-grpc:latest
  minikube image load aws-rest-grpc-m1-rest:latest
  ```
* **Kind (Kubernetes in Docker)**:
  ```bash
  kind load docker-image aws-rest-grpc-m2-grpc:latest
  kind load docker-image aws-rest-grpc-m1-rest:latest
  ```

### Paso C: Aplicar los Manifiestos de Kubernetes
Despliega los servicios y componentes aplicando secuencialmente los archivos en el clúster:
```bash
# 1. Crear el namespace aislado 'yape-app'
kubectl apply -f k8s/namespace.yaml

# 2. Levantar los deployments y servicios de M1 y M2
kubectl apply -f k8s/
```

### Paso D: Verificar Estado del Clúster
Valida que todos los recursos se hayan inicializado correctamente y que los pods se encuentren en estado `Running`:
```bash
kubectl get all -n yape-app
```
*Deberías ver 2 pods activos de `m1-rest` y 2 pods activos de `m2-grpc` mapeados a sus servicios respectivos.*

---

## 📖 Manual de Usuario y Guía de Uso del API

Una vez levantado el sistema (ya sea por Docker Compose o por Kubernetes), puedes interactuar enviando solicitudes HTTP.

* **Si usas Docker Compose**: Hacia el puerto **`3001`** (`http://localhost:3001`)
* **Si usas Kubernetes**: Hacia el puerto NodePort **`32001`** (`http://localhost:32001`) o alternativamente usando port-forwarding:
  ```bash
  kubectl port-forward service/m1-rest 3001:3000 -n yape-app
  # (Esto permite seguir usando http://localhost:3001 para tus pruebas)
  ```

### 🩺 1. Verificar Estado de Salud
* **Endpoint**: `/health`
* **Método**: `GET`
* **cURL (Kubernetes / NodePort)**:
  ```bash
  curl http://localhost:32001/health
  ```
* **Respuesta Esperada**:
  ```json
  {
    "status": "UP",
    "service": "m1-rest"
  }
  ```

### 💸 2. Realizar Transferencia (Yapear)
* **Endpoint**: `/api/yape/transfer`
* **Método**: `POST`
* **Headers**: `Content-Type: application/json`

---

## 🧪 Casos de Prueba Detallados

A continuación, se listan los comandos de PowerShell y cURL para validar el comportamiento del sistema.

### Caso A: Transferencia Exitosa entre Billeteras (S/. 50.00)
Transferiremos S/. 50.00 de Juan Pérez (`987654321`) a María Rodríguez (`912345678`).

* **Comando en PowerShell (Puerto NodePort 32001)**:
  ```powershell
  $body = @{
    sourcePhoneNumber = "987654321"
    destinationPhoneNumber = "912345678"
    amount = 50.00
    description = "Pago de almuerzo"
  } | ConvertTo-Json

  Invoke-RestMethod -Uri http://localhost:32001/api/yape/transfer -Method Post -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 4
  ```
* **Equivalente en cURL (Bash)**:
  ```bash
  curl -X POST http://localhost:32001/api/yape/transfer \
    -H "Content-Type: application/json" \
    -d '{"sourcePhoneNumber": "987654321", "destinationPhoneNumber": "912345678", "amount": 50.00, "description": "Pago de almuerzo"}'
  ```
* **Respuesta Esperada (HTTP 200)**:
  ```json
  {
    "status": "success",
    "data": {
      "transactionId": "tx-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "source": {
        "phoneNumber": "987654321",
        "owner": "Juan Perez"
      },
      "destination": {
        "phoneNumber": "912345678",
        "owner": "Maria Rodriguez"
      },
      "amount": 50,
      "description": "Pago de almuerzo",
      "message": "Transferencia realizada con éxito",
      "timestamp": "2026-05-28T01:55:52.286Z"
    }
  }
  ```

---

### Caso B: Fondos Insuficientes (Regla de Dominio M2)
Intentamos transferir S/. 100.00 desde María Rodríguez (`912345678` - Saldo actual S/. 60.00 post Caso A) hacia Carlos Mendoza (`999888777`).

* **Comando en PowerShell**:
  ```powershell
  try {
    $body = @{
      sourcePhoneNumber = "912345678"
      destinationPhoneNumber = "999888777"
      amount = 100.00
      description = "Intento sin fondos"
    } | ConvertTo-Json

    Invoke-RestMethod -Uri http://localhost:32001/api/yape/transfer -Method Post -Body $body -ContentType "application/json"
  } catch {
    Write-Host "Respuesta del Servidor: $_"
  }
  ```
* **Respuesta Esperada (HTTP 400)**:
  ```json
  {
    "status": "fail",
    "message": "Saldo insuficiente para realizar la transferencia."
  }
  ```

---

### Caso C: Billetera de Destino No Existe
Intentamos enviar dinero a un número celular inexistente (`900000000`).

* **Comando en PowerShell**:
  ```powershell
  try {
    $body = @{
      sourcePhoneNumber = "987654321"
      destinationPhoneNumber = "900000000"
      amount = 10.00
    } | ConvertTo-Json

    Invoke-RestMethod -Uri http://localhost:32001/api/yape/transfer -Method Post -Body $body -ContentType "application/json"
  } catch {
    Write-Host "Respuesta del Servidor: $_"
  }
  ```
* **Respuesta Esperada (HTTP 400)**:
  ```json
  {
    "status": "fail",
    "message": "La billetera de destino con celular 900000000 no existe."
  }
  ```

---

### Caso D: Validación de Formato de Celular (Sintáctica M1)
Enviamos un teléfono mal formateado o con dígitos erróneos.

* **Comando en PowerShell**:
  ```powershell
  try {
    $body = @{
      sourcePhoneNumber = "12345"
      destinationPhoneNumber = "999888777"
      amount = 10.00
    } | ConvertTo-Json

    Invoke-RestMethod -Uri http://localhost:32001/api/yape/transfer -Method Post -Body $body -ContentType "application/json"
  } catch {
    Write-Host "Respuesta del Servidor: $_"
  }
  ```
* **Respuesta Esperada (HTTP 400)**:
  ```json
  {
    "status": "fail",
    "errors": [
      "sourcePhoneNumber debe ser un número de celular peruano válido (9 dígitos, empieza con 9)."
    ]
  }
  ```

---

### Caso E: Auto-transferencia No Permitida
Intentamos enviarnos dinero a nosotros mismos.

* **Comando en PowerShell**:
  ```powershell
  try {
    $body = @{
      sourcePhoneNumber = "987654321"
      destinationPhoneNumber = "987654321"
      amount = 10.00
    } | ConvertTo-Json

    Invoke-RestMethod -Uri http://localhost:32001/api/yape/transfer -Method Post -Body $body -ContentType "application/json"
  } catch {
    Write-Host "Respuesta del Servidor: $_"
  }
  ```
* **Respuesta Esperada (HTTP 400)**:
  ```json
  {
    "status": "fail",
    "errors": [
      "El celular de origen y destino no pueden ser iguales."
    ]
  }
  ```

---

## 🪵 Monitoreo de Logs en Kubernetes

Para observar los flujos de comunicación REST y gRPC de forma distribuida en Kubernetes, puedes monitorear los logs de los pods asociados en tiempo real:

```bash
# Ver logs del Gateway REST (M1)
kubectl logs -l app=m1-rest -n yape-app --tail=30 -f

# Ver logs del Core gRPC (M2)
kubectl logs -l app=m2-grpc -n yape-app --tail=30 -f
```

---

## 🧹 Limpieza del Entorno en Kubernetes

Cuando desees remover todos los recursos de Kubernetes desplegados (Deployments, Services y el Namespace), simplemente corre:
```bash
kubectl delete -f k8s/
kubectl delete -f k8s/namespace.yaml
```
Esto removerá el namespace `yape-app` liberando todos los recursos de computación asignados.

---

## 💻 3. Frontend Web en Angular (Interfaz Premium)

Hemos diseñado e implementado una **interfaz web premium y profesional** para el ecosistema Yape BCP utilizando **Angular v19** (con la convención moderna de nombres de archivos 2025 y reactividad basada en **Signals**). El diseño visual sigue la estética premium **Dark Glassmorphic** generada mediante **Stitch MCP**, incorporando degradados elegantes en púrpura y verde-esmeralda, blur de fondo y bordes traslúcidos.

### 🌟 Características Clave del Frontend:
* **Dashboard Completo**: Visualización de saldo en tiempo real, estado de salud en vivo del microservicio de API (M1), barra lateral persistente y lista reactiva de movimientos recientes.
* **Módulo de Envío ("Yapear")**: Formulario interactivo con validación de expresiones regulares de teléfonos celulares peruanos (`^9\d{8}$`), control dinámico de fondos suficientes y prevención de auto-transferencia.
* **Selección Rápida de Contactos**: Botones con atajos para rellenar instantáneamente la información de contacto de María, Carlos o Pedro.
* **Estado Compartido y Reactivo**: Al realizar un yapeo exitoso, el saldo se descuenta automáticamente en el Dashboard y la nueva transferencia se añade a la cima del historial de transacciones.
* **Conectividad REST en tiempo real**: Consume de forma nativa los servicios del backend REST Gateway.

---

### 🏃‍♂️ Ejecución en Desarrollo Local
Sigue estos pasos si deseas ejecutar y depurar la aplicación en tu host fuera de Docker:

```bash
# 1. Navegar al directorio del frontend
cd yape-frontend

# 2. Iniciar el servidor de desarrollo de Angular
npm run start
```
* La aplicación se compilará y estará disponible en **`http://localhost:4200`** en tu navegador.
* El frontend se comunicará directamente con el REST API de M1 en `http://localhost:3001` gracias al middleware CORS configurado.

---

### 🐳 Ejecución con Docker Compose
La orquestación de Docker Compose en la raíz del proyecto ha sido actualizada para compilar y servir de forma automatizada la aplicación web:

```bash
# Levantar todo el ecosistema (Core gRPC, Gateway REST, y Frontend Web)
docker-compose up -d --build
```
* El frontend web de Yape estará expuesto públicamente en **`http://localhost:4200`** servido a través de **Nginx de producción**, el cual redirige la navegación SPA de forma interna y eficiente a `/index.html`.

---

### ☸️ Despliegue en Kubernetes (K8s)
Hemos provisto el manifiesto declarativo `k8s/yape-frontend.yaml` para orquestar la aplicación frontend dentro de Kubernetes con réplicas redundantes para tolerancia a fallos.

#### Paso A: Compilar la Imagen del Frontend en tu Clúster Local
```bash
# Compilar la imagen docker en el host
docker build -t aws-rest-grpc-yape-frontend:latest -f yape-frontend/Dockerfile ./yape-frontend
```

#### Paso B: Cargar la Imagen en tu Clúster (Si aplica)
* **Minikube**: `minikube image load aws-rest-grpc-yape-frontend:latest`
* **Kind**: `kind load docker-image aws-rest-grpc-yape-frontend:latest`

#### Paso C: Aplicar los Manifiestos
```bash
# Aplicar el despliegue del frontend
kubectl apply -f k8s/yape-frontend.yaml
```

#### Paso D: Acceso y Verificación
El servicio del frontend está expuesto como **NodePort** estático en el puerto **`32002`**.
* Abre en tu navegador la URL: **`http://localhost:32002`** para acceder a la aplicación.
* *Nota:* Para comunicarte con el backend REST dentro del clúster de Kubernetes, asegúrate de mantener levantado el servicio M1 en el NodePort `32001`. El frontend y backend operan sincronizados localmente a través de la redirección de puertos del clúster.

