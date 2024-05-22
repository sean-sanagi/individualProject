package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.TodoData;

@Repository
public interface TodoRepository extends JpaRepository<TodoData, Integer> {
	//	public List<TodoData> findAllByOrderByDeadlineDesc();
}
