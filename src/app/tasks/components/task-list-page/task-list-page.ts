import { Component, signal } from '@angular/core';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { TaskItem } from '../task-item/task-item';
import { Task } from '../../interfaces/task';

@Component({
  selector: 'task-list-page',
  imports: [TaskItem, MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatIcon],
  templateUrl: './task-list-page.html',
  styleUrl: './task-list-page.scss',
})
export class TaskListPage {
  pendingExpanded = signal(true);
  tasks = signal<Task[]>([
    {
      id: "1",
      title: "Muchas tareas de ejemplo para probar el scroll en vista móvil",
      priority: "LOW"
    },
    {
      id: "2",
      title: "Y ver que tal aparecen y desaparecen las barras al subir y bajar",
      priority: "HIGH"
    },
    {
      id: "3",
      title: "Además de como se va adaptando el diseño al redimensionar todo",
      priority: "MEDIUM"
    },
    {
      id: "4",
      title: "Pintar la casa",
      priority: "LOW"
    },
    {
      id: "5",
      title: "Comprar entradas",
      priority: "MEDIUM"
    },
    {
      id: "6",
      title: "Sacar al perro",
      priority: "HIGH"
    },
    {
      id: "7",
      title: "Pintar la casa",
      priority: "LOW"
    },
    {
      id: "8",
      title: "Pintar la casa",
      priority: "LOW"
    },
    {
      id: "9",
      title: "Pintar la casa",
      priority: "LOW"
    },
    {
      id: "10",
      title: "Pintar la casa",
      priority: "LOW"
    },
    {
      id: "11",
      title: "Pintar la casa",
      priority: "LOW"
    },
    {
      id: "12",
      title: "Pintar la casa",
      priority: "LOW"
    },
    {
      id: "13",
      title: "Pintar la casa",
      priority: "LOW"
    },
    {
      id: "14",
      title: "Pintar la casa",
      priority: "LOW"
    },
    {
      id: "15",
      title: "Pintar la casa",
      priority: "LOW"
    },
    {
      id: "16",
      title: "Pintar la casa",
      priority: "LOW"
    },
    {
      id: "17",
      title: "Pintar la casa",
      priority: "LOW"
    },
  ]);
}
