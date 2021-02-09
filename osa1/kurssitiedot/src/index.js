import React from 'react'
import ReactDOM from 'react-dom'


const Header = (props) =>{  /*Kurssin nimen renderöijä*/
    return(
      <div>
        <h1>{props.course}</h1>
      </div>
    )
}

const Content = (props) =>{ /*Kurssien sisällön/osien renderöijä*/
  console.log(props.parts[0].name)
  console.log(props.parts[1].exercises)
  return (
    <div>
      <Part name={props.parts[0].name} exercises={props.parts[0].exercises}/>
      <Part name={props.parts[1].name} exercises={props.parts[1].exercises} />
      <Part name={props.parts[2].name} exercises={props.parts[2].exercises} />
    </div>
  
  )
}
const Part = (props) =>{ /*<p>{props.name} <Total exercises={props.exercises}/></p>*/
  return(
    <div>
      <p> {props.name} {props.exercises}</p>                      
    </div>
  ) 
}

const Total = (props) =>{ /*Kurssien tehtävä määrien renderöijä*/
  /*AP idea-> console.log(props.parts.map(arvo => arvo.exercises))  
  const t = props.parts.map(arvo => arvo.exercises) */
  
  let summa = 0
  props.parts.forEach(sum => {
    summa = sum.exercises + summa
  });
  return(
    <div>
      <p>Kurssien maara {summa} </p>
    </div>
  )
}


const App = () => {

  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>    
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))