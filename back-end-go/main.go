package main

import (
	"back-end-go/api/router"
	"back-end-go/config"
	_ "back-end-go/docs"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

// func register
// @title API
// @version 1.0
// @description Example of a user API with Swagger.
// @host localhost:8080
// @BasePath /
func  main()  {
	// charger le fichier .env
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Errzue lors du chargement du fichier .env : %v", err)
	}

	jwtSecret := os.Getenv("JWT_SECRET_KEY")
	fmt.Println("Clé secrète :", jwtSecret)

	// Initialisation de la base de données
	db, err := config.InitializeDatabase()
	if err != nil {
		log.Fatal("erreur de connexion à la BDD : ",err)
	}
	defer db.Close()

	r := router.SetupRouter(db)

	r.Run()
}