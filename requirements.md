# Project Requirements Specification

## Project Description

MoveRest is a simple and user-friendly application designed to help users track exercise habits and daily wellbeing.

The purpose of the application is to encourage healthier habits and make it easier for users to understand how their energy, discomfort, or recovery affects their activity levels.


## Functional Requirements

### Manual Workout Registration

The user must be able to manually register a workout session.

Type of workout
- Duration of the workout
- Intensity (easy, medium, hard)
- Daily status (green or red)
- Reason for red status if selected
- Optional comment or note

Note: It should also be possible to register only comment such as "Sick - Flue" or "On Vacation" And they should be marked with the color Brown



### Daily Status Registration

The application must allow the user to select:
- Green day (good condition)
- Red day (bad condition)

The selected status must be connected to:

The registered workout
The selected reason
The selected date
Red/Green Reason Selection

And then get logged in the calendar

When the user selects the red option, the application must display different reasons:

- Pain
- Discomfort
- Low Energy

The user must choose one reason before continuing.
The application must then provide a feedback based on the user’s selected status and reason.

Examples:

Green day → motivational feedback
Pain → recommendation to rest
Low Energy → recommendation for lighter activity
Calendar Functionality - it will all get logged for that day

The application must contain a calendar where users can:

View logged days
Register workouts
Save comments or notes
See whether a day is marked green or red

### The calendar should visually display:

Green indicators for positive days
Red indicators for difficult days
Daily Notes and Comments

The user must be able to save comments for a selected day.

Examples:

“Sick today”
“Good recovery”
“Tired after work”
User-Friendly Design

### The application must:

Be simple and intuitive
Require few clicks - userfriendly
Have a clean layout
Work on mobile screens
The application should load quickly
The interface should be responsive
Data should be stored locally using localStorage
The application should work without a backend server

### The application will be developed using:

HTML
CSS
JavaScript
VS Code
GitHub

### The MVP version will not require:

Backend server
Database
Login system