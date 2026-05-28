# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard.spec.ts >> Dashboard Page >> should show the current balance card
- Location: e2e\dashboard.spec.ts:15:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('S/. 150.00')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('S/. 150.00')

```

```yaml
- complementary:
  - text: send_to_mobile
  - heading "Yape BCP" [level=1]
  - paragraph: Finanzas Digitales
  - navigation:
    - link "dashboard Dashboard":
      - /url: /dashboard
    - link "send_to_mobile Yapear":
      - /url: /yapear
    - text: history Historial person Mi Cuenta
  - link "add Nuevo Yapeo":
    - /url: /yapear
  - text: JP
  - heading "Juan Pérez" [level=4]
  - paragraph: "987654321"
- heading "Bienvenido, Juan Pérez" [level=2]
- paragraph: jueves, 28 de mayo de 2026
- text: M1 Offline
- button "refresh"
- text: account_balance_wallet
- paragraph: Saldo Disponible
- heading "S/. 150,00" [level=3]
- text: verified Cuenta BCP Activa • 987654321
- link "send_to_mobile Yapear":
  - /url: /yapear
- text: request_quote Solicitar qr_code_2 Mi QR
- heading "history Movimientos Recientes" [level=3]
- text: trending_flat
- 'heading "Para: María Rodríguez" [level=4]'
- paragraph: Enviado • 912345678
- text: "- S/. 50,00"
- paragraph: 28/05/2026, 08:14
- text: trending_flat
- 'heading "De: Carlos Mendoza" [level=4]'
- paragraph: Recibido • 999888777
- text: + S/. 25,00
- paragraph: 27/05/2026, 10:14
- text: trending_flat
- 'heading "Para: María Rodríguez" [level=4]'
- paragraph: Enviado • 912345678
- text: "- S/. 10,00"
- paragraph: 26/05/2026, 10:14
- heading "Contactos Frecuentes" [level=3]
- link "MR María Rodríguez 912 345 678":
  - /url: /yapear
  - text: MR
  - paragraph: María Rodríguez
  - paragraph: 912 345 678
- link "CM Carlos Mendoza 999 888 777":
  - /url: /yapear
  - text: CM
  - paragraph: Carlos Mendoza
  - paragraph: 999 888 777
- link "PO Pedro Ortiz 987 123 456":
  - /url: /yapear
  - text: PO
  - paragraph: Pedro Ortiz
  - paragraph: 987 123 456
- link "search Buscar otro contacto":
  - /url: /yapear
```

```
Tearing down "context" exceeded the test timeout of 30000ms.
```