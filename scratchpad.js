//memory
room{
  jobs{
    job{
      workers : set(),
      tasks : set(),
      assignments: {worker.id : task.id}
    }
  }
}

creep{
  jobs{
    job : task.id;
  }
}
