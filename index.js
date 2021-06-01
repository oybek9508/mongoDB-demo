const mongoose = require('mongoose')
mongoose
  .connect('mongodb://localhost/playground')
  .then(() => console.log('Connecting to mongoDB...'))
  .catch((err) => console.log('Error connecting to mongoDB...'))

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 25 },
  author: String,
  category: {
    type: String,
    required: true,
    enum: ['web', 'mobile', 'network'],
  },
  tags: [String],
  date: { type: Date, date: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    // here we cannot use arrow function because arrow function does not have this. property
    required: function () {
      return this.isPublished
    },
    min: 10,
    max: 200,
  },
})

const Course = mongoose.model('Course', courseSchema)

const createCourse = async () => {
  const course = new Course({
    name: 'NodeJS',
    category: '-',
    author: 'Oybek',
    tags: ['React', 'frontend'],
    isPublished: true,
    price: 15,
  })
  try {
    const result = await course.save()
    console.log(result)
  } catch (error) {
    console.log(error.message)
  }
}

// COMPARISON OPERATORS IN MONGODB
// eq - equal
// ne - not equal
// gt - greater than
// gte - greater than or equal to
// lt - less than
// lte - less than or equal to
// in
// nin - not in
// or
// and

const getCourses = async () => {
  const pageNumber = 1
  const pageSize = 10
  const courses = await Course.find({ author: 'Oybek', isPublished: true })
    // only returns the courses that the price is 10$
    // .find({price: 10})
    // returns the courses that are priced between $10 and $20
    // .find({price: {$gte: 10, $lte: 20}})
    // returns the courses that are priced $10, $15 and $20
    // .find({price: {$in: [10, 15, 20]}})
    // when returning author: 'Oybek' or isPublished: true we use or operator. However, we have to use find() with no arguments
    // .find()
    // .or([{ author: 'Oybek' }, { isPublished: true }])
    // and is also used almost in the same way, we just need to write and in place of or
    // .and([{author: "Oybek"}, {isPublished: true}])
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .select({ name: 1, tags: 1 })
    .sort({ name: 1 })
    .count()
  console.log('getting courses: ', courses)
}

// First approach
// const updateCourse = async (id) => {
//   const course = await Course.findById(id)
//   if (!course) return
//   course.isPublished = true
//   course.author = 'Another Author'

//   // the second approad
//   // course.set({
//   //   isPublished: true,
//   //   author: 'Another Author'
//   // })

//   const result = await course.save()
//   console.log('Result ', result)
// }
// Second approach
const updateCourse = async (id) => {
  const result = await Course.findByIdAndUpdate(
    id,
    {
      $set: {
        author: 'Khlalid',
        isPublished: true,
      },
    },
    { new: true }
  )
  console.log(result)
}

const deleteCourse = async (id) => {
  const course = await Course.findByIdAndRemove(id)
  console.log(course)
}
// getCourses()
// deleteCourse('60b058f7b6019bf547738023')
createCourse()
