package main

import (
	"back-end-go/api/router"
	"back-end-go/config"
	_ "back-end-go/docs"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

// func register
// @title User API
// @version 1.0
// @description Example of a user API with Swagger.
// @host localhost:8080
// @BasePath /
func  main()  {
	
	// Initialisation de la base de données
	db, err := config.InitializeDatabase()
	if err != nil {
		log.Fatal("Erreur de connexion à la BDD : %v",err)
	}
	defer db.Close()

	r := router.SetupRouter(db)

	r.Run()
}