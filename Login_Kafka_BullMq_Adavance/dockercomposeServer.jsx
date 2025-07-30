version: "3.8"
services:
  frontend:
    build: ./frontend
  
    ports:
      - "3000:3000"
    volumes:
      - ./frontend/src:/app/src
    stdin_open: true
    tty: true
    networks:
      - frontend_network

  backend:
    build: ./backend
 
    container_name: basic-container
    ports:
      - 9000:9000
    volumes:
      - ./Backend:/app
    networks:
      - backend_network

  mongodb:
    image: "mongo"
    volumes:
      - data:/data/db
    networks:
      - backend_network

  prom-server:
    image: prom/prometheus
    ports:
      - 9090:9090
    volumes:
      - ./backend/prometheus-config.yml:/etc/prometheus/prometheus.yml
    networks:
      - frontend_network
      - backend_network

volumes:
  data:

networks:
  frontend_network:
  backend_network:



# version: "3.8"

# services:
#   frontend:
#     build: ./frontend
#     ports:
#       - "3000:3000"
#     volumes:
#       - ./frontend/src:/app/src
#     stdin_open: true
#     tty: true
#   backend:
#     build: ./backend
#     container_name: basic-container
#     ports:
#       - 9000:9000
#     volumes:
#       - ./backend:/app

#   mongodb:
#     image: "mongo"
#     volumes:
#       - data:/data/db

#   prom-server:
#     image: prom/prometheus
#     ports:
#       - 9090:9090
#     volumes:
#       - ./backend/prometheus-config.yml:/etc/prometheus/prometheus.yml

# volumes:
#   data: