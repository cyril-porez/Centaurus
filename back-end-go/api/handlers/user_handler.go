package handlers

import (
	"back-end-go/model"
	"back-end-go/service"
	"back-end-go/utils"
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

	err := service.CreateUser(c, db, &newUser)
	if err !=nil {
		utils.WriteErrorResponse(c, http.StatusInternalServerError, "Internal Server Error", []utils.ErrorDetail{
			{
				Field: "unknown",
				Issue: "erreur lors de la création de l'utilisateur",
			},
		})
	}	else {
		c.JSON(http.StatusOK, gin.H {
			"message": "Utilisateur créé avec succès",
			"user": newUser,
		})
	}
}