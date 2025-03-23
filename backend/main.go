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

	envFile := "../.env";

	appEnv := os.Getenv("APP_ENV");

	if appEnv == "docker" {
		envFile = "/app/.env";
	}

	err := godotenv.Load(envFile)
	if err != nil {
		log.Printf("Impossible de charger le fichier %s : %v", envFile, err)
	}

	appEnv = os.Getenv("APP_ENV");
	databaseUrl := os.Getenv("DATABASE_URL");
	localeDataBaseUrl := os.Getenv("LOCAL_DATABASE_URL");
	jwtSecret := os.Getenv("JWT_SECRET_KEY");
	port := os.Getenv("PORT");

	

	fmt.Println("appEnv : ", appEnv)
	fmt.Println("docker : ", databaseUrl);
	fmt.Println("local : ", localeDataBaseUrl);
	fmt.Println("Clé secrète :", jwtSecret)
	fmt.Println("port :", port)

	var dns string
	if appEnv == "docker" {
		dns = databaseUrl
	} else {
		dns = localeDataBaseUrl
	}

	// Initialisation de la base de données
	db, err := config.InitializeDatabase(dns)
	if err != nil {
		log.Fatal("erreur de connexion à la BDD : ",err)
	}
	defer db.Close()

	queryDB := `CREATE DATABASE IF NOT EXISTS centaurus`
	_, err = db.Exec(queryDB);
	if err != nil {
		log.Fatalf("error lors de la creation de la BDD centaurus : %v", err)
	}
	fmt.Println("BDD centaurus créé avec succès")

	queryUsers := `CREATE TABLE IF NOT EXISTS users (
		id INT AUTO_INCREMENT PRIMARY KEY,
		username VARCHAR(255) NOT NULL,
		password VARCHAR(255) NOT NULL,
		email VARCHAR(255) NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	) DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;` 

	_,err = db.Exec(queryUsers)
	if err != nil {
		log.Fatalf("error lors de la creation de la table users : %v", err)
	}
	fmt.Println("Table users créé avec succès")

	query := `CREATE TABLE IF NOT EXISTS horses (
		id INT AUTO_INCREMENT PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		age INT NOT NULL,
		race VARCHAR(255) NOT NULL,
		fk_user_id INT NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (fk_user_id) REFERENCES users(id) ON DELETE CASCADE
	) DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;`

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
	) DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;`

	_, err = db.Exec(queryWeight)
	if err != nil {
		log.Fatalf("error lors de la creation de la table weights : %v", err)
	}
	fmt.Println("Table weifhts créé avec succès")

 	r := router.SetupRouter(db)

	r.Run(":" + port)
}