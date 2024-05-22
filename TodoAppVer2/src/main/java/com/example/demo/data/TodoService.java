package com.example.demo.data;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.TodoData;
import com.example.demo.repository.TodoRepository;

@Service
public class TodoService {
	@Autowired
	private TodoRepository repository;

	public List<TodoData> getAll() {
		System.out.println("TODOの一覧を所得");
		return repository.findAll();
	}

	/*@return 保存されたEntityのID、成功しない場合は0*/
	public int add(TodoData data) {
		System.out.println("add");
		if (data instanceof TodoData) {
			TodoData savedData = repository.saveAndFlush((TodoData) data);
			return savedData.getId();
		}
		return 0;
	}

	// 	delete method 
	public void delete(TodoData data) {
		System.out.println("delete method");
		if (data instanceof TodoData) {
			repository.delete((TodoData) data);
		}
	}

}
