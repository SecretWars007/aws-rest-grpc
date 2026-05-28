# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard.spec.ts >> Dashboard Page >> should show account phone number
- Location: e2e\dashboard.spec.ts:20:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Tearing down "context" exceeded the test timeout of 30000ms.
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - complementary [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e7]: send_to_mobile
      - generic [ref=e8]:
        - heading "Yape BCP" [level=1] [ref=e9]
        - paragraph [ref=e10]: Finanzas Digitales
    - navigation [ref=e11]:
      - link "dashboard Dashboard" [ref=e12] [cursor=pointer]:
        - /url: /dashboard
        - generic [ref=e13]: dashboard
        - generic [ref=e14]: Dashboard
      - link "send_to_mobile Yapear" [ref=e15] [cursor=pointer]:
        - /url: /yapear
        - generic [ref=e16]: send_to_mobile
        - generic [ref=e17]: Yapear
      - generic [ref=e18]:
        - generic [ref=e19]: history
        - generic [ref=e20]: Historial
      - generic [ref=e21]:
        - generic [ref=e22]: person
        - generic [ref=e23]: Mi Cuenta
    - link "add Nuevo Yapeo" [ref=e25] [cursor=pointer]:
      - /url: /yapear
      - generic [ref=e26]:
        - generic [ref=e27]: add
        - text: Nuevo Yapeo
    - generic [ref=e28]:
      - generic [ref=e29]: JP
      - generic [ref=e30]:
        - heading "Juan Pérez" [level=4] [ref=e31]
        - paragraph [ref=e32]: "987654321"
  - generic [ref=e35]:
    - generic [ref=e36]:
      - generic [ref=e37]:
        - heading "Bienvenido, Juan Pérez" [level=2] [ref=e38]
        - paragraph [ref=e39]: jueves, 28 de mayo de 2026
      - generic [ref=e40]:
        - generic [ref=e42]: M1 Offline
        - button "refresh" [ref=e43] [cursor=pointer]:
          - generic [ref=e44]: refresh
    - generic [ref=e45]:
      - generic [ref=e46]:
        - generic [ref=e47]:
          - generic [ref=e50]: account_balance_wallet
          - generic [ref=e51]:
            - paragraph [ref=e52]: Saldo Disponible
            - heading "S/. 150,00" [level=3] [ref=e53]
            - generic [ref=e54]:
              - generic [ref=e55]: verified
              - generic [ref=e56]: Cuenta BCP Activa • 987654321
        - generic [ref=e57]:
          - link "send_to_mobile Yapear" [ref=e58] [cursor=pointer]:
            - /url: /yapear
            - generic [ref=e60]: send_to_mobile
            - generic [ref=e61]: Yapear
          - generic [ref=e62]:
            - generic [ref=e64]: request_quote
            - generic [ref=e65]: Solicitar
          - generic [ref=e66]:
            - generic [ref=e68]: qr_code_2
            - generic [ref=e69]: Mi QR
        - generic [ref=e70]:
          - heading "history Movimientos Recientes" [level=3] [ref=e71]:
            - generic [ref=e72]: history
            - text: Movimientos Recientes
          - generic [ref=e73]:
            - generic [ref=e74]:
              - generic [ref=e75]:
                - generic [ref=e77]: trending_flat
                - generic [ref=e78]:
                  - 'heading "Para: María Rodríguez" [level=4] [ref=e79]'
                  - paragraph [ref=e80]: Enviado • 912345678
              - generic [ref=e81]:
                - text: "- S/. 50,00"
                - paragraph [ref=e82]: 28/05/2026, 08:17
            - generic [ref=e83]:
              - generic [ref=e84]:
                - generic [ref=e86]: trending_flat
                - generic [ref=e87]:
                  - 'heading "De: Carlos Mendoza" [level=4] [ref=e88]'
                  - paragraph [ref=e89]: Recibido • 999888777
              - generic [ref=e90]:
                - text: + S/. 25,00
                - paragraph [ref=e91]: 27/05/2026, 10:17
            - generic [ref=e92]:
              - generic [ref=e93]:
                - generic [ref=e95]: trending_flat
                - generic [ref=e96]:
                  - 'heading "Para: María Rodríguez" [level=4] [ref=e97]'
                  - paragraph [ref=e98]: Enviado • 912345678
              - generic [ref=e99]:
                - text: "- S/. 10,00"
                - paragraph [ref=e100]: 26/05/2026, 10:17
      - generic [ref=e102]:
        - heading "Contactos Frecuentes" [level=3] [ref=e103]
        - generic [ref=e104]:
          - link "MR María Rodríguez 912 345 678" [ref=e105] [cursor=pointer]:
            - /url: /yapear
            - generic [ref=e106]: MR
            - generic [ref=e107]:
              - paragraph [ref=e108]: María Rodríguez
              - paragraph [ref=e109]: 912 345 678
          - link "CM Carlos Mendoza 999 888 777" [ref=e110] [cursor=pointer]:
            - /url: /yapear
            - generic [ref=e111]: CM
            - generic [ref=e112]:
              - paragraph [ref=e113]: Carlos Mendoza
              - paragraph [ref=e114]: 999 888 777
          - link "PO Pedro Ortiz 987 123 456" [ref=e115] [cursor=pointer]:
            - /url: /yapear
            - generic [ref=e116]: PO
            - generic [ref=e117]:
              - paragraph [ref=e118]: Pedro Ortiz
              - paragraph [ref=e119]: 987 123 456
        - link "search Buscar otro contacto" [ref=e120] [cursor=pointer]:
          - /url: /yapear
          - generic [ref=e121]: search
          - text: Buscar otro contacto
```