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

	query := `CREATE TABLE IF NOT EXISTS horses (
		id INT AUTO_INCREMENT PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		age INT NOT NULL,
		race VARCHAR(255) NOT NULL,
		fk_user_id INT NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (fk_user_id) REFERENCES users(id) ON DELETE CASCADE
	)`

	_, err = db.Exec(query)
	if err != nil {
		log.Fatalf("error lors de la creation de la table horses : %v", err)
	}
	fmt.Println("Table horses créé avec succès")

	queryWeight := `CREATE TABLE IF NOT EXISTS weights (
		id INT AUTO_INCREMENT PRIMARY KEY,
		weight INT NOT NULL,
		fk_horse_id INT NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (fk_horse_id) REFERENCES horses(id) ON DELETE CASCADE
	)`

	_, err = db.Exec(queryWeight)
	if err != nil {
		log.Fatalf("error lors de la creation de la table weights : %v", err)
	}
	fmt.Println("Table weifhts créé avec succès")

 	r := router.SetupRouter(db)

	r.Run()
}