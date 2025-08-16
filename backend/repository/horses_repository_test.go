package repository_test

import (
	"testing"

	"back-end-go/model"
	"back-end-go/repository"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
)


func TestInsertHorse_Success(t *testing.T) {
	db, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer db.Close()

	input := &model.Horses{
		Name:     "Yakari",
		Race:     "Pur-sang",
		Age:      5,
		FkUserId: 1,
	}

	mock.ExpectExec("INSERT INTO horses").
		WithArgs(input.Name, input.Race, input.Age, input.FkUserId, sqlmock.AnyArg()).
		WillReturnResult(sqlmock.NewResult(1, 1))

	repo := &repository.SQLHorseRepository{}
	err = repo.InsertHorse(db, input)
	assert.NoError(t, err)
	assert.Equal(t, 1, input.Id)
	assert.NoError(t, mock.ExpectationsWereMet())
}
