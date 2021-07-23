import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private taskRepository: TasksRepository,
  ) {}

  //Display all services
  getTasks(): Promise<Task[]> {
    return this.taskRepository.getTasks();
  }

  // Display service by id
  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Task with ID ${id} is not found`);
    }
    return found;
  }

  //Creating a service
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  //Deleting a service by id
  async deleteTask(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);
    //console.log(result); // affected: 1 if present else 0
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} is not found`);
    }
  }

  // Updating a service
  async updateTask(id: string, createTaskDto: CreateTaskDto): Promise<Task> {
    const task = await this.getTaskById(id);
    const { uname, description, user } = createTaskDto;
    task.description = description;
    task.uname = uname;
    task.user = user;
    await this.taskRepository.save(task);

    return task;
  }
}
