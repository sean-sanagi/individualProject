package com.example.demo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.data.TodoService;
import com.example.demo.model.TodoData;

@RestController
public class TodoController {

	@Autowired
	private TodoService service;

	@GetMapping("/")
	@CrossOrigin
	public List<TodoData> index() {
		System.out.println("/index");
		return service.getAll();
	}

	@PostMapping("/add")
	@CrossOrigin
	public int add(@RequestBody TodoData todo) {
		System.out.println("addします");
		return service.add(todo);
	}

	@PostMapping("/delete")
	@CrossOrigin
	public void delete(@RequestBody TodoData todo) {
		System.out.println("deleteします");
		service.delete(todo);
	}

}
