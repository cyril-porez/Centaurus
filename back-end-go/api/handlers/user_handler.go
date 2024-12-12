package handlers

import (
	"back-end-go/model"
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
	var err error
	if err = c.ShouldBindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	query := "INSERT INTO users (username, password, email)	Values (?,?,?)"
	_, err = db.Exec(query, newUser.Username, newUser.Password, newUser.Email)
	if err !=nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de l'insersion dans la BDD"})
	}

	c.JSON(http.StatusOK, gin.H {
		"message": "Utilisateur créé avec succès",
		"user": newUser,
	})
}