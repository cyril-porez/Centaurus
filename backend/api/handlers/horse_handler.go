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

//AddHorseHandler godoc
//@Summary add a horse test
//@Description add a h  test
//@Tags Horses
//@Accept json
//@Produce json
//@Param addhorse body model.Horses true "Name, Age and Race"
//@Success 201 {object} model.Horses "Horse created"
//@Failure 400 {object} map[string]string
//@Failure 401 {object} map[sting]string
//@Failure 500 {object} map[string]string
//@Router /api/v1/horses [post]
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

	resp := gin.H{
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

	// utils.WriteSuccesResponse(c, http.StatusCreated, "Registration new successful", body)
	utils.WriteSuccesResponse2(c, http.StatusCreated, resp)
}

//UpdateHorseHandler godoc
//@Summary Update a horse
//@Description add a profil user
//@Tags Horses
//@Accept json
//@Produce json
//@Param addhorse body model.Horses true "Name, Age and Race"
//@Success 201 {object} model.Horses "Horse created"
//@Failure 400 {object} map[string]string
//@Failure 401 {object} map[sting]string
//@Failure 500 {object} map[string]string
//@Router /api/v1/horses/{id} [put]
func UpdateHorseHandler(c *gin.Context, db *sql.DB, id string) {
	// var horse model.Horses
	var horse model.HorseUpdate

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

	resp := gin.H {
		"Hoese": horse,		
		"Links": model.Links{
			SignIn: model.Link{
				Method: "PUT",
				Href:   "/api/v1/horses/update",
			},
		},
		"Meta": model.Meta{
			WelcomeMessage: "You get data a horses for a user",
		},
	}

	utils.WriteSuccesResponse2(c, http.StatusOK, resp)	
}

//GetHorseHandler godoc
//@Summary Get a horse
//@Description Retrieve a horse for a specific user
//@Tags Horses
//@Accept json
//@Produce json
//@Param id path int true "Horse Id"
//@Success 201 {object} model.Horses "Horse retrieved"
//@Failure 400 {object} map[string]string
//@Failure 401 {object} map[sting]string
//@Failure 500 {object} map[string]string
//@Router /api/v1/horses/{id} [get]
func GetHorseHandler(c *gin.Context, db *sql.DB, id string) {
	var horse model.Horses
	
	if details, err := service.GetHorse(db, &horse, id); err != nil || len(details) > 0 {
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

	resp := gin.H{
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
			"welcomeMessage": "You get data a horse",
		},
	}

	utils.WriteSuccesResponse2(c, http.StatusOK, resp)
}

// GetHorsesByUserHanndler godoc
//@Summary Get horses by user ID 
//@Description Retrieve a list of horses for a specific user
//@Tags Horses
//@Accept json
//@Produce json
//@Param id path int true "User ID"
//@Success 200 {object} model.Horses "Horses retrived succesfully"
//@Failure 400 {object} map[string]interface{} "Bad request"
//@Failure 401 {object} map[sting]interface{} ""
//@Failure 500 {object} map[string]interface{} "Internal server error"
//@Router /api/v1/users/{id}/horses [get]
func GetHorsesByUserHanndler(c *gin.Context, db *sql.DB, id string ) {
	
	horses, details, err := service.GetHorsesByUserId(db, id);
	if err != nil || len(details) > 0 {
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

	resp := model.HorsesResponse{
		Horse: model.HorseData{
			Data: horses,
		},
		Links: model.Links{
			SignIn: model.Link{
				Method: "PUT",
				Href:   "/api/v1/horses/update",
			},
		},
		Meta: model.Meta{
			Count: len(horses),
			WelcomeMessage: "You get data a horses for a user",
		},
	}

	utils.WriteSuccesResponse2(c, http.StatusOK, resp)
}

// DeleteHorseHanndler godoc
//@Summary delete a horse 
//@Description Delete horse
//@Tags Horses
//@Accept json
//@Produce json
//@Param id path int true "Horse ID"
//@Success 200 {object} model.Horses "Horses récupéré"
//@Failure 400 {object} map[string]string
//@Failure 401 {object} map[sting]string
//@Failure 500 {object} map[string]string
//@Router /api/v1/horses/{id} [delete]
func DeleteHorseHandler(c *gin.Context, db *sql.DB, id string) {
	
	if details, err := service.DeleteHorse(db, id); err != nil || len(details) > 0 {
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
		return;
	}

	resp := gin.H{
    "horse": gin.H{
      "horse": "delete",
		},
		"_links": gin.H{
        "sign-in": gin.H{
					"href":"/api/v1/horses/update",
					"Method": "PUT", 
				},
		},
		"meta": gin.H{
			"deletedAt": time.Now().Format(time.RFC1123),
			"welcomeMessage": "horse deleted with success", 
		},
	}

	// utils.WriteSuccesResponse(c, http.StatusOK, "horse deleted successful", body);
	utils.WriteSuccesResponse2(c, http.StatusOK, resp)
}