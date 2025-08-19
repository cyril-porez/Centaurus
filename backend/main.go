package main

import (
	"back-end-go/api/router"
	_ "back-end-go/docs"
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/go-sql-driver/mysql"
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

	// envFile := "../.env";
	// envFile := "/app/.env";

	envFile := os.Getenv("ENV_FILE")
	if envFile == "" {
		// envFile = "/env/.env" // fallback si non défini
		envFile = "../.env"
	} 

	// appEnv := os.Getenv("APP_ENV");

	// if appEnv == "docker" {
	// 	envFile = "/app/.env";
	// }

	err := godotenv.Load(envFile)
	if err != nil {
		log.Printf("Impossible de charger le fichier %s : %v", envFile, err)
	}

	appEnv := os.Getenv("APP_ENV");
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

	const dbName = "centaurus"

	cfg, err := mysql.ParseDSN(dns)
  if err != nil {
    log.Fatalf("parse DSN: %v", err)
  }

	serverCfg := *cfg
  serverCfg.DBName = "" // <- important
  serverDB, err :=  sql.Open("mysql", serverCfg.FormatDSN())
  if err != nil {
    log.Fatalf("connect server (no DB): %v", err)
  }
  defer serverDB.Close()
	// Initialisation de la base de données
	// db, err := config.InitializeDatabase(dns)
	// if err != nil {
	// 	log.Fatal("erreur de connexion à la BDD : ",err)
	// }
	// defer db.Close()

	if err := serverDB.Ping(); err != nil {
    log.Fatalf("ping server (no DB): %v", err)
  }

	_,err = serverDB.Exec(fmt.Sprintf(
		"CREATE DATABASE IF NOT EXISTS `%s` DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci",
		dbName,	
	))
	if err != nil {
    log.Fatalf("create database %s: %v", dbName, err)
  }

	_, _ = serverDB.Exec(fmt.Sprintf(
    "ALTER DATABASE `%s` CHARACTER SET = utf8 COLLATE = utf8_general_ci",
    dbName,
  ))

	cfg.DBName = dbName
  db, err := sql.Open("mysql", cfg.FormatDSN())
  if err != nil {
    log.Fatalf("connect db %s: %v", dbName, err)
  }
	defer db.Close()

  if err := db.Ping(); err != nil {
    _ = db.Close()
    log.Fatalf("ping db %s: %v", dbName, err)
	}
	fmt.Println("BDD centaurus OK (créée si besoin)")

	// _, err = db.Exec(queryDB);
	// if err != nil {
	// 	log.Fatalf("error lors de la creation de la BDD centaurus : %v", err)
	// }
	// fmt.Println("BDD centaurus créé avec succès")

	queryUsers := `CREATE TABLE IF NOT EXISTS users (
		id INT AUTO_INCREMENT PRIMARY KEY,
		username VARCHAR(255) NOT NULL,
		password VARCHAR(255) NOT NULL,
		email VARCHAR(255) NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;` 

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
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;`

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
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;`

	_, err = db.Exec(queryWeight)
	if err != nil {
		log.Fatalf("error lors de la creation de la table weights : %v", err)
	}
	fmt.Println("Table weifhts créé avec succès")

 	r := router.SetupRouter(db)

	r.Run(":" + port)
}