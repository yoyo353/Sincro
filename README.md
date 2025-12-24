# 📱 Sincro

Aplicación móvil orientada a parejas, diseñada para **acompañarse y estar en sintonía durante el ciclo menstrual**, mediante un sistema de calendario compartido con **consentimiento, privacidad y control total de datos**.

El objetivo no es el control, sino mejorar la comunicación, la empatía y el acompañamiento dentro de la relación.

---

## 🧠 Concepto de Sincro

* Una persona registra su ciclo menstrual y **decide qué información compartir**.
* La pareja visualiza **solo indicadores simples**, sin datos médicos.
* El sistema genera **recordatorios empáticos** y sugerencias suaves.

---

## 🗂️ Diagrama de Base de Datos (ER)

```
┌──────────────┐
│    users     │
├──────────────┤
│ id (PK)      │
│ name         │
│ email        │
│ password     │
│ created_at   │
└───────┬──────┘
        │
        │ 1
        │
        ▼
┌──────────────────┐
│  relationships   │
├──────────────────┤
│ id (PK)          │
│ owner_id (FK)    │◄── Ella
│ viewer_id (FK)   │◄── Pareja
│ status           │
│ created_at       │
└───────┬──────────┘
        │
        │ 1
        ▼
┌─────────────────────┐
│ sharing_permissions │
├─────────────────────┤
│ id (PK)             │
│ relationship_id FK  │
│ show_phase          │
│ show_exact_days     │
│ show_mood           │
│ show_notifications  │
└─────────────────────┘

┌──────────────┐
│   cycles     │
├──────────────┤
│ id (PK)      │
│ user_id (FK) │
│ start_date   │
│ end_date     │
│ cycle_length │
│ notes        │
└───────┬──────┘
        │
        │ 1
        ▼
┌──────────────┐
│  symptoms    │
├──────────────┤
│ id (PK)      │
│ cycle_id FK  │
│ type         │
│ intensity    │
│ created_at   │
└──────────────┘

┌──────────────┐
│ mood_logs    │
├──────────────┤
│ id (PK)      │
│ user_id FK   │
│ date         │
│ mood         │
│ note         │
└──────────────┘

┌──────────────┐
│ notifications│
├──────────────┤
│ id (PK)      │
│ user_id FK   │
│ date         │
│ message      │
│ delivered    │
└──────────────┘
```

---

## 📱 Flujo General de la Aplicación

### Perfil: Persona que registra el ciclo

1. Bienvenida empática
2. Configuración inicial del ciclo
3. Calendario personal
4. Registro opcional de síntomas y estado de ánimo
5. Compartir con pareja (invitación)
6. Gestión de permisos y privacidad

### Perfil: Pareja

1. Aceptar invitación
2. Calendario compartido (vista simplificada)
3. Recordatorios empáticos
4. Tips breves de acompañamiento

---

## 🛠️ Stack Tecnológico (Propuesto)

### Frontend

* Android (Kotlin + Jetpack Compose)
* Alternativa: React Native / Flutter

### Backend

* Node.js + Express o NestJS
* API REST
* Autenticación JWT

### Base de Datos

* PostgreSQL / Firebase

### Seguridad

* Cifrado de datos sensibles
* Control de permisos por relación
* Revocación inmediata de acceso

---

## 🚀 MVP (Producto Mínimo Viable)

Funcionalidades incluidas:

* Registro básico de ciclo
* Calendario mensual
* Invitación de pareja
* Indicadores simples (verde / amarillo / rojo)
* Notificaciones básicas

No incluye:

* IA predictiva avanzada
* Análisis médico
* Datos clínicos

---

## 🧭 Filosofía de Sincro

> “Entender es una forma de querer mejor.”

Sincro se construye bajo los principios de:

* Consentimiento
* Respeto
* Empatía
* Control del usuario

---

## 📄 Licencia

Proyecto personal / educativo.
Uso no comercial por el momento.

---

## ✨ Próximos Pasos

* Wireframes en Figma
* Implementación del backend base
* Pruebas con datos ficticios
* Feedback del usuario final

---

💙 Proyecto desarrollado con enfoque humano y técnico.
