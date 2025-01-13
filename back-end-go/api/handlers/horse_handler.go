package handlers

import (
	"back-end-go/model"
	"back-end-go/service"
	"back-end-go/utils"
	"database/sql"
	"net/http"
	"time"

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
	var newHorse model.Horses

	if err := c.ShouldBindJSON(&newHorse); err != nil {
		body := utils.ErrorResponseInput{
			Details : []utils.ErrorDetail{
				{
					Field: "body",
					Issue: "The provided data is not valid",
				},
			},
			Meta : map[string]string{
				"timestamp": time.Now().Format(time.RFC3339),
			},
			Links : gin.H{
				"self":   "/api/v1/horses/update",
				"Method": "POST",
			},
		}
		utils.WriteErrorResponse(c, http.StatusBadRequest, "Invalid REquest", body)
		return
	}

	
	if details, err := service.CreateHorse(db, &newHorse); err != nil || len(details) > 0 {
		if len(details) > 0 {
			utils.WriteErrorResponse(c, http.StatusBadRequest, "Validation Error", utils.ErrorResponseInput{
				Details: details,
				Meta: map[string]string{
					"timestamp": time.Now().Format(time.RFC3339),
				},
				Links : gin.H{
					"sign-in": gin.H{
						"self":   "/api/v1/horses/update",
						"METHOD": "PUT",
					},
				},
			})
		} else {
			utils.WriteErrorResponse(c, http.StatusInternalServerError, "internal Server Error", utils.ErrorResponseInput{
				Meta: map[string]string{
					"timestamp": time.Now().Format(time.RFC3339),
				},
				Links : gin.H{
					"sign-in": gin.H{
						"self":   "/api/v1/auth/signin",
						"METHOD": "POST",
					},
				},
			})
		} 
		return
	}	

	body := gin.H{
    "horse": gin.H{
      "name": newHorse.Name,
			"age": newHorse.Age,
			"race": newHorse.Race,
			"fk_user_id": newHorse.FkUserId,
		},
		"_links": gin.H{
        "sign-in": gin.H{
					"href":"/api/v1/horses/update",
					"Method": "PUT", 
				},
		},
		"meta": gin.H{
			"createdAt": newHorse.CreatedAt,
			"welcomeMessage": "You add a new horse", 
		},
	}

	utils.WriteSuccesResponse(c, http.StatusCreated, "Registration new successful", body)
}

func UpdateHorseHandler(c *gin.Context, db *sql.DB, id string) {
	var horse model.Horses

	if err := c.ShouldBindJSON(&horse); err != nil {
		body := utils.ErrorResponseInput{
			Details : []utils.ErrorDetail{
				{
					Field: "body",
					Issue: "The provided data is not valid",
				},
			},
			Meta : map[string]string{
				"timestamp": time.Now().Format(time.RFC3339),
			},
			Links : gin.H{
				"self":   "/api/v1/horses/update",
				"Method": "POST",
			},
		}
		utils.WriteErrorResponse(c, http.StatusBadRequest, "Invalid REquest", body)
		return
	}

	if details, err := service.UpdateHorse(db, &horse, id); err != nil || len(details) > 0 {
		if len(details) > 0 {
			utils.WriteErrorResponse(c, http.StatusBadRequest, "Validation Error", utils.ErrorResponseInput{
				Details: details,
				Meta: map[string]string{
					"timestamp": time.Now().Format(time.RFC3339),
				},
				Links : gin.H{
					"sign-in": gin.H{
						"self":   "/api/v1/horses/update",
						"METHOD": "PUT",
					},
				},
			})
		} else {
			utils.WriteErrorResponse(c, http.StatusInternalServerError, "internal Server Error", utils.ErrorResponseInput{
				Meta: map[string]string{
					"timestamp": time.Now().Format(time.RFC3339),
				},
				Links : gin.H{
					"sign-in": gin.H{
						"self":   "/api/v1/auth/signin",
						"METHOD": "POST",
					},
				},
			})
		} 
		return
	}
	
	body := gin.H{
    "horse": gin.H{
      "name": horse.Name,
			"age": horse.Age,
			"race": horse.Race,
			"fk_user_id": horse.FkUserId,
		},
		"_links": gin.H{
        "sign-in": gin.H{
					"href":"/api/v1/horses/update",
					"Method": "PUT", 
				},
		},
		"meta": gin.H{
			"createdAt": horse.CreatedAt,
			"welcomeMessage": "You add a new horse", 
		},
	}

	utils.WriteSuccesResponse(c, http.StatusCreated, "Registration new successful", body)
	// c.JSON(http.StatusOK, gin.H{
	// 	"message": "Horse updated successfully",
	// 	"id": id,
	// })
}