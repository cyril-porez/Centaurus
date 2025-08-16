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
)

type mockHorseRepo struct{
    shouldFailInsert bool
    shouldFailGet    bool
    shouldFailDelete bool
    shouldFailUpdate bool
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
    if m.shouldFailGet { return nil, errors.New("db error") }
    return []model.Horses{
        {Id: 1, Name: "Yakari", Age: 5, Race: "Pur-sang", FkUserId: userId},
        {Id: 2, Name: "Spirit", Age: 6, Race: "Arabe",   FkUserId: userId},
    }, nil
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

    assert.NoError(t, err) // c’est le contrat de ta fonction, vérifie que ça correspond à ce que tu veux
    assert.Nil(t, horse)
    assert.NotEmpty(t, details)
    assert.Equal(t, "database", details[0].Field)
}
