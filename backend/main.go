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
	dockerDSN := os.Getenv("DATABASE_URL");
	localeDSN := os.Getenv("LOCAL_DATABASE_URL");
	jwtSecret := os.Getenv("JWT_SECRET_KEY");
	port := os.Getenv("PORT");

	

	fmt.Println("appEnv : ", appEnv)
	fmt.Println("docker : ", dockerDSN);
	fmt.Println("local : ", localeDSN);
	fmt.Println("Clé secrète :", jwtSecret)
	fmt.Println("port :", port)

	dns := localeDSN
	if appEnv == "docker" {
		dns = dockerDSN
	} 

	db, err := config.EnsureDatabaseAndConnect(dns, "centaurus")
	if err != nil {
		log.Fatal("DB bootstrao error: ", err)
	}
  defer db.Close()

  if err := config.Migrate(db); err != nil {
		log.Fatal("migration error: ", err)
	}
	fmt.Println("DB ready !!!")

	r := router.SetupRouter(db)
	if  err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}