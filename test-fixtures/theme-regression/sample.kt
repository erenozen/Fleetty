package com.fleetty.regression

sealed class TodoAdapterItem {
    data class ActiveParent(val title: String, val count: Int) : TodoAdapterItem()
    data class CompletedParent(val title: String, val isExpanded: Boolean) : TodoAdapterItem()
}

class TodoViewModel(
    private val repository: TodoRepository,
) {
    fun load(categoryId: Long?): List<TodoAdapterItem> {
        val items = repository.items(categoryId)
        return if (items.isEmpty()) {
            emptyList()
        } else {
            items.map { item ->
                TodoAdapterItem.ActiveParent(item.title, item.subtasks.size)
            }
        }
    }
}

interface TodoRepository {
    fun items(categoryId: Long?): List<Todo>
}

data class Todo(val title: String, val subtasks: List<String>)
