const express = require('express')
const cors = require('cors')
const {routeGuard} = require('../../route-guard')
const EventsService = require('./service')

const eventsRoutes = new express.Router()

eventsRoutes.use(express.json())
eventsRoutes.use(cors())

eventsRoutes.get('/', async (req, res) => {
  try {
    const events = await EventsService.findMany(req.query)
    res.json(events)
  } catch (err) {
    console.error(err)
    res.status(500).json({error: err.message})
  }
})

eventsRoutes.post('/', routeGuard, async (req, res) => {
  try {
    const event = await EventsService.createOne(req.body)
    res.json(event)
  } catch (err) {
    console.error(err)
    res.status(500).json({error: err.message})
  }
})

eventsRoutes.post('/mass-import', routeGuard, async (req, res) => {
  try {
    const events = JSON.parse(req.body.data)
    await EventsService.createMany(events)
    res.json(true)
  } catch (err) {
    console.error(err)
    res.status(500).json({error: err.message})
  }
})

eventsRoutes.get('/:id', async (req, res) => {
  try {
    const event = await EventsService.findOneOrFail(req.params.id)
    res.json(event)
  } catch (err) {
    console.error(err)
    res.status(500).json({error: err.message})
  }
})

eventsRoutes.put('/:id', routeGuard, async (req, res) => {
  try {
    const event = await EventsService.updateOne(req.params.id, req.body)
    res.json(event)
  } catch (err) {
    console.error(err)
    res.status(500).json({error: err.message})
  }
})

eventsRoutes.delete('/:id', routeGuard, async (req, res) => {
  try {
    const event = await EventsService.deleteOne(req.params.id)
    res.json(event)
  } catch (err) {
    console.error(err)
    res.status(500).json({error: err.message})
  }
})

module.exports = eventsRoutes
