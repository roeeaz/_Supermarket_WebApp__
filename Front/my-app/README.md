# Roee's Supermarket Web Application 🛒

A supermarket web application that offers a seamless buying experience for customers. Built with a  tech stack including Django, React, Redux, and TypeScript, the application presents an intuitive user interface and efficient backend management.

# Live web url:
 roee-supermarket.netlify.app
(if you dont see the categories when you open the web for the first time,do refresh and wait 1-2 minuets)

# 🚀 Features
User-friendly Interface: Easily browse and purchase products.
Secure Transactions: Implementing secure handling of customer information.


# 🛠 Local Development Setup
## 🔒 Setting Up a Virtual Environment
It's recommended to create a virtual environment:

Windows:
run in terminal:
python -m venv myenv
myenv\Scripts\activate


macOS and Linux::
run in terminal:
python3 -m venv myenv
source myenv/bin/activate

# 📦 Requirements
pip install -r requirements.txt

# Backend Server
To run the backend server, open a terminal for the backend and run:
py manage.py runserver

# Frontend Server
To run the frontend server, open a terminal for the frontend and run:
npm start

## The application will run locally at http://localhost:3000.


# 🐳 Docker 
First, build the Docker image for the project by running the following command in the root directory:
docker build -t my-app .

## Running the Docker Container
After building the image, you can run the container with:

docker run -p 3000:3000 my-app

This will start the application and make it accessible at http://localhost:3000.


