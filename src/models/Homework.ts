import * as mongoose from 'mongoose'

const HomeworkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Kindly enter the name of the homework'
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: [{
      type: String,
      enum: ['pending', 'ongoing', 'completed']
    }],
    default: ['pending']
  },
})

export default mongoose.model('Homeworks', HomeworkSchema)

