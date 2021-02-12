import React from 'react'

const Course = ({course}) =>{
    return(
      <div>
        <h1>{course.name}</h1>
          {course.parts.map(course => <p key={course.id}>{course.name} {course.exercises} </p>)}
         <h4>Total of {course.parts.reduce((sum, e) => sum + e.exercises, 0)} exercises</h4>
      </div>
    )
}

export default Course


