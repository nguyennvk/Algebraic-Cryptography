# Algebraic Cryptography help tools
This project aims to provide a quick and robust calculation to some common cryptography calculations related to MAT302 at UTM.
It supports various area in Algebra like field, modulo, primary, etc.

The Project is hosted at https://algrebraic-helps.online/
# Tech stack
Backend: Flask, numpy, sympy
Frontend: Nextjs, Tailwind CSS

# Installation and setup
## Container
Both directories be and frontend contain Dockerfile and docker-compose.yaml files.
The backend will be hosted at localhost:5555
The frontend will be hosted at localhost:3000
To run the application, 
In be directory,
```
docker compose up -d --build
```
In fe directory,
```
docker compose up -d --build
```
Note: If you are to change the URL of fe and be you need to indicate this changes in the be/app.py to prevent CORS error
and create .env file with 
```
NEXT_PUBLIC_BACKEND_URL= Your backend url
```
## Local
In be directory,
```
pip install -r requirements.txt
```
```
python app.py
```
In fe directory,
```
npm i
npm run build
npm run dev
```
