const Part = (props) => {
  return (
    <p>
      {props.part.name} {props.part.exercises}
    </p>
  )
}

const Header = (props) => {
  return <h2>{props.name}</h2>
}

const Content = (props) => {
  return props.parts.map((part) => (
      <Part part={part} key={part.id}/>
  ))
}

const Total = (props) => {
  return (
    <b><p>
    total of {props.parts.reduce((total, currentPart) => total + currentPart.exercises, 0)} exercises
    </p></b>
  )
}

const Course = (props) => {
  return (
    <>
      <Header name={props.course.name}/>
      <Content parts={props.course.parts}/>
      <Total parts={props.course.parts}/>
    </>
  )
}


export default Course 
