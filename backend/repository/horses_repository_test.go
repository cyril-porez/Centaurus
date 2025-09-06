package repository_test

import (
	"testing"

	"back-end-go/model"
	"back-end-go/repository"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
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
		WithArgs(input.Name, input.Age, input.Race, input.FkUserId).
		WillReturnResult(sqlmock.NewResult(1, 1))

	repo := &repository.SQLHorseRepository{}
	err = repo.InsertHorse(db, input)
	assert.NoError(t, err)
	assert.Equal(t, 1, input.Id)
	assert.NoError(t, mock.ExpectationsWereMet())
}

func TestGetHorsesByUserId_Success(t *testing.T) {
	db, mock, err := sqlmock.New()
	require.NoError(t, err)
	defer db.Close()

	rows := sqlmock.NewRows([]string{"id","name","age","race","fk_user_id","created_at"}).
		AddRow(1, "Yakari", 5, "Pur-sang", 42, "2025-01-01T00:00:00Z").
		AddRow(2, "Spirit", 6, "Arabe",    42, "2025-01-02T00:00:00Z")

	mock.ExpectQuery(`^SELECT id, name, age, race, fk_user_id, created_at FROM horses WHERE fk_user_id\s*=\s*\?$`).
		WithArgs(42).
		WillReturnRows(rows)

	repo := &repository.SQLHorseRepository{}
	out, err := repo.GetHorsesByUserId(db, 42)
	require.NoError(t, err)
	assert.Len(t, out, 2)
	require.NoError(t, mock.ExpectationsWereMet())
}

func TestUpdateHorse_Success(t *testing.T) {
	db, mock, err := sqlmock.New()
	require.NoError(t, err)
	defer db.Close()

	input := &model.HorseUpdateInput{Name: "Yakari+", Age: 6, Race: "Pur-sang"}
	// adapte le pattern à ta requête UPDATE
	mock.ExpectExec(`^UPDATE\s+horses\s+SET\s+name\s*=\s*\?,\s*age\s*=\s*\?,\s*race\s*=\s*\?,\s*updated_at\s*=\s*\?\s+WHERE\s+id\s*=\s*\?$`).
	WithArgs(input.Name, input.Age, input.Race, sqlmock.AnyArg(), 1).	
	WillReturnResult(sqlmock.NewResult(0, 1))

	repo := &repository.SQLHorseRepository{}
	err = repo.UpdateHorse(db, input, 1)
	require.NoError(t, err)
	require.NoError(t, mock.ExpectationsWereMet())
}

func TestDeleteHorse_NotFound(t *testing.T) {
	db, mock, err := sqlmock.New()
	require.NoError(t, err)
	defer db.Close()

	mock.ExpectExec(`^DELETE\s+FROM\s+` + "`horses`" + `\s+WHERE\s+id\s*=\s*\?$`).
		WithArgs(999).
		WillReturnResult(sqlmock.NewResult(0, 0)) // 0 ligne touchée

	repo := &repository.SQLHorseRepository{}
	err = repo.DeleteHorse(db, 999)
	require.Error(t, err)
	require.NoError(t, mock.ExpectationsWereMet())
}


