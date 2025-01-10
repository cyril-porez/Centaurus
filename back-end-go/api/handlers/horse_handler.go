package handlers

import (
	"database/sql"

	"github.com/gin-gonic/gin"
)

//SignInHandler godoc
//@Summary add a horse
//@Description add a profil user
//@Tags Horses
//@Accept json
//@Produce json
//@Param addhorse body model.Horses true "Name, Age and Race"
//@Success 201 {object} model.Horses "Horse created"
//@Failure 400 {object} map[string]string
//@Failure 401 {object} map[sting]string
//@Failure 500 {object} map[string]string
//@Router /api/v1/horses/add-horse [post]
func AddHorseHandler(c *gin.Context, db *sql.DB) {

}