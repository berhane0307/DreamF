import knexFile from './knexfile.js'
import knex from 'knex'
import type { Location, LocationData } from '../../models/Location.ts'
import type { Event, EventWithLocation, EventData } from '../../models/Event.ts'

type Environment = 'production' | 'test' | 'development'

const environment = (process.env.NODE_ENV || 'development') as Environment
const config = knexFile[environment]
export const connection = knex(config)

export async function getAllLocations() {
  const locations: unknown[] = await connection('locations').select() // TODO: replace this with your knex query
  return locations as Location[]
}

export async function getEventsByDay(day: any) {
  const eventByDay = await connection('events')
    .join('locations', 'events.location_id ', 'locations.id')
    .where({ day: day })
    .select(
      'events.id as id',
      'events.day as day',
      'events.time as time',
      'events.name as eventName',
      'events.description as description',
      'locations.name as locationName',
    )
  console.log(eventByDay)
  return eventByDay
}

export async function getLocationById(id: any) {
  const locationById = await connection('locations')
    .where({ id: id })
    .select()
    .first()
  console.log(locationById)
  return locationById
}

export async function updateLocation(
  id: number,
  name: string,
  description: string,
) {
  const editLocation = await connection('locations')
    .where({ id: id })
    .update({ name: name, description: description })
  console.log(editLocation)
  return editLocation
}

export async function addNewEvent(
  name: string,
  description: string,
  time: string,
  locationId: number,
  day: string,
) {
  const newEvent = await connection('events').insert({
    day: day,
    description: description,
    location_id: locationId,
    name: name,
    time: time,
  })
  console.log(newEvent)
  return newEvent
}

export async function deleteEvent(id: number) {
  const result = await connection('events').where('events.id', id).delete()
  return result
}