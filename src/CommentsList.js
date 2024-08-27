import React, { useEffect, useState } from "react";

const CommentsList = () => {
  const [comments, setComments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredComments, setFilteredComments] = useState([]);

  const commentsPerPage = 20;

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/comments")
      .then((response) => response.json())
      .then((data) => {
        setComments(data);
        setFilteredComments(data);
      });
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const filtered = comments.filter((comment) =>
        comment.body.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredComments(filtered);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, comments]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Calculate current comments to display based on pagination
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = filteredComments.slice(
    indexOfFirstComment,
    indexOfLastComment
  );

  // Render comments
  const renderComments = currentComments.map((comment) => (
    <div key={comment.id}>
      <h4>{comment.name}</h4>
      <p>{comment.body}</p>
    </div>
  ));

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate pagination numbers
  const totalPages = Math.ceil(filteredComments.length / commentsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <h1>Comments List</h1>
      <input
        type="text"
        placeholder="Search comments..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <div>{renderComments}</div>
      <div>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={currentPage === number ? "active" : ""}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CommentsList;
