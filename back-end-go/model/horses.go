package model

import "time"

type Horses struct {
	Id        int    		`json:"id"`
	Name      string 		`json:"name" binding:"required"`
	Age       int    		`json:"age" binding:"required"`
	Race      string 		`json:"race" binding:"required"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}