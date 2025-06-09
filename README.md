# Mizu and Binki Calendar 🐾

**Mizu and Binki Calendar** is a fun side project built in a day to help my family manage cat-sitting days. It includes an interactive React frontend and a simple Express server that sends friendly SMS reminders using Twilio. All bookings are stored in Firebase Realtime Database, ensuring everything stays up-to-date in real-time.

<img width="700" alt="image" src="https://github.com/user-attachments/assets/b4290b2b-4c1b-4491-977c-fd7e007a3414" />

*Schedule View with Color-Coded Bookings*

## Features

- **Interactive Calendar**: Click on dates to see who’s booked or to confirm your own booking.
- **Schedule View**: Easily view all bookings with clear color indicators:
  - **Past Bookings**: Greyed out.
  - **Next Upcoming Booking**: Highlighted in green.
- **Booking Modal**: Simple form to confirm your booking.
- **Checklist**: Handy cat care checklist to keep track of tasks.
- **Automated SMS Reminders**: The server sends daily reminders to tomorrow’s cat sitter.
- **Responsive Design**: Looks great on both desktop and mobile devices.

## Technologies Used

### Frontend

- **React** with **TypeScript**
- **Tailwind CSS** for styling
- **Headless UI** for accessible components
- **React Calendar** for the calendar interface
- **Firebase Realtime Database** for storing bookings

### Server

- **Node.js** with **Express**
- **Firebase Realtime Database** for fetching booking data
- **Node-Cron** for scheduling daily tasks
- **Twilio** for sending SMS reminders
- **dotenv** for environment variable management

## How It Works

1. **Booking a Date**:
   - Use the interactive calendar to select an available date.
   - Confirm your booking by entering your name.
   - The booking is saved to Firebase and immediately reflected in the Schedule View.

2. **Viewing the Schedule**:
   - The Schedule View lists all bookings.
   - Past bookings are greyed out, and the next upcoming booking is highlighted in green.
   - Easily switch between Schedule and Calendar views with a toggle button.

3. **Automated Reminders**:
   - The Express server runs a cron job every day at 9 AM Toronto time.
   - It fetches the cat sitter scheduled for the next day from Firebase.
   - If a valid phone number is found, Twilio sends a friendly SMS reminder to the sitter.

## Screenshots

<img width="455" alt="image" src="https://github.com/user-attachments/assets/2b22f1a8-352e-4652-8c9b-1ed4c35b9eb4" />

*Interactive Calendar for Booking Dates*

<img width="371" alt="image" src="https://github.com/user-attachments/assets/9c889596-c535-4706-9f18-e93bda2e8765" />

*Cat Care Checklist*

## Quick Notes

- **Not for Production**: It’s a personal project, so feel free to fork and customize it as you like!
- **Environment Variables**: Make sure to set up your `.env` file with Firebase and Twilio credentials if you want to run the server locally.

## License

This project is open-source and available under the [MIT License](LICENSE).

---
