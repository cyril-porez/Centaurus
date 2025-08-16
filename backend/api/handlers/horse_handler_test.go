package handlers_test

import (
	"back-end-go/api/handlers"
	"back-end-go/repository"
	"back-end-go/service"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/gin-gonic/gin"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestAddHorseHandler(t *testing.T) {
	db, mock, err := sqlmock.New()
	require.NoError(t, err)
	defer db.Close()	

	mock.ExpectExec("INSERT INTO horses").
			WithArgs("bolt", "Autre", 5, 15, sqlmock.AnyArg()).
			WillReturnResult(sqlmock.NewResult(1, 1))

	repo := &repository.SQLHorseRepository{}
	horseService := service.NewHorseService(repo)

	gin.SetMode(gin.TestMode)
	router := gin.New()

	router.POST("/api/v1/horses", func(c *gin.Context){
		c.Set("userID", 15)
		handlers.AddHorseHandler(c, db, horseService)
	}) 

	reqBody := `{
        "name": "bolt",
        "age": 5,
        "race": "Autre"
    }`
	
	req, _ := http.NewRequest("POST", "/api/v1/horses", strings.NewReader(reqBody))
  req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
  router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
  assert.Contains(t, w.Body.String(), "bolt")
  assert.Contains(t, w.Body.String(), `"race":"Autre"`)

	require.NoError(t, mock.ExpectationsWereMet())
}