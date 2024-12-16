package handlers

import (
	"back-end-go/model"
	"back-end-go/service"
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

//RegisterHandler godoc
//@Summary Register a new user
//@Description Register a new user
//@Tags Users
//@Accept json
//@Produce json
//@Param user body User true "User"
//@Success 200 {object} User "User created successfully"
//@Failure 400 {object} map[string]string
//@Failure 500 {object} map[string]string
//@Router /register [post]
func RegisterHandler(c *gin.Context, db *sql.DB) {
	var newUser model.User
	if err := c.ShouldBindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := service.CreateUser(db, &newUser)
	if err !=nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la création de "})
	}

	c.JSON(http.StatusOK, gin.H {
		"message": "Utilisateur créé avec succès",
		"user": newUser,
	})
}