package service_test

import (
	"back-end-go/interfaces"
	"back-end-go/model"
	"back-end-go/service"
	"fmt"

	"database/sql"
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type mockHorseRepo struct{
    shouldFailInsert bool
    shouldFailGet    bool
    shouldFailDelete bool
    shouldFailUpdate bool
    insErr, getErr, listErr, updErr, delErr error
    h *model.Horses
    byUser []model.Horses
}

func (m *mockHorseRepo) InsertHorse(db *sql.DB, horse *model.Horses) error {
    if m.shouldFailInsert {
        return errors.New("db error")
    }
    return nil
}

func (m *mockHorseRepo) GetHorseById(db *sql.DB, id int) (*model.Horses, error) { // <- AJOUT
    // Si ton service utilise GetHorseById, retourne une valeur de test
    if m.shouldFailGet { return nil, errors.New("db error") }
    return &model.Horses{Id: id, Name: "Yakari", Age: 5, Race: "Pur-sang", FkUserId: 1}, nil
}

func (m *mockHorseRepo) GetHorsesByUserId(db *sql.DB, userId int) ([]model.Horses, error) {
    // if m.shouldFailGet { return nil, errors.New("db error") }
    // return []model.Horses{
    //     {Id: 1, Name: "Yakari", Age: 5, Race: "Pur-sang", FkUserId: userId},
    //     {Id: 2, Name: "Spirit", Age: 6, Race: "Arabe",   FkUserId: userId},
    // }, nil
    if m.listErr != nil {
        return nil, m.listErr
    }
    return m.byUser, nil
}

func (m *mockHorseRepo) DeleteHorse(db *sql.DB, id int) error {
    if m.shouldFailDelete {
        return errors.New("db error")
    }
    if id == 999 {
        return fmt.Errorf("no horse found with id %d", id)
    }
    return nil
}

func (m *mockHorseRepo) UpdateHorse(db *sql.DB, input *model.HorseUpdateInput, id int) error {
    if m.shouldFailUpdate {
        return errors.New("db error")
    }
    return nil
}

var _ interfaces.HorseRepository = (*mockHorseRepo)(nil)
func TestCreateHorseService_Success(t *testing.T) {
    repo := &mockHorseRepo{}
    svc := service.NewHorseService(repo)

    input := &model.HorseInput{Name: "Yakari", Age: 5, Race: "Pur-sang", FkUserId: 1}
    horse, details, err := svc.CreateHorse(nil, input)

    assert.NoError(t, err)
    assert.Nil(t, details)
    assert.NotNil(t, horse)
    assert.Equal(t, "Yakari", horse.Name)
}

func TestCreateHorseService_DBError(t *testing.T) {
    repo := &mockHorseRepo{shouldFailInsert: true}
    svc := service.NewHorseService(repo)

    input := &model.HorseInput{Name: "Yakari", Age: 5, Race: "Pur-sang", FkUserId: 1}
    horse, details, err := svc.CreateHorse(nil, input)

    assert.NoError(t, err)
    assert.Nil(t, horse)
    assert.NotEmpty(t, details)
    assert.Equal(t, "database", details[0].Field)
}

func TestService_GetHorsesByUserId_Empty(t *testing.T) {
	repo := &mockHorseRepo{byUser: []model.Horses{}}
	svc := service.NewHorseService(repo)

	out, details, err := svc.GetHorsesByUserId(nil, 42)
	require.NoError(t, err)
	assert.Nil(t, out)
	require.Len(t, details, 1) // "result" : "no horses found for this user" si tu as gardé ça
}

func TestService_DeleteHorse_NotFound(t *testing.T) {
	repo := &mockHorseRepo{}
	svc := service.NewHorseService(repo)

	err := svc.DeleteHorse(nil, 999)
	require.Error(t, err)
}