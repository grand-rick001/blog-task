import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/services/blog.service';
import { Blog } from 'src/app/models/Blog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  blogs: Blog[] = [];
  hasSearched: boolean = false;
  allCategoryKey: string = 'View All';
  selectedCategory: string = this.allCategoryKey;
  errorMsg: string = '';

  constructor (private blogService: BlogService) {
    this.blogService.getBlogs().subscribe(data => this.blogs = data,
                                          error => this.errorMsg = error);
  }

  ngOnInit(): void {}

  onSearch(searchTerm: string): void {
    /* Removing white space from the search term. */
    searchTerm = searchTerm.split(' ').filter(Boolean).join('');

    this.blogService.getBlogs().subscribe(data => {
      let filteredBlogs: Blog[] = data;

      if (this.selectedCategory !== this.allCategoryKey) {
        filteredBlogs = filteredBlogs.filter(blog => blog.category === this.selectedCategory);
      }

      if (searchTerm) {
        const blogTitle: string = searchTerm.toLowerCase().split(' ').join('');
        filteredBlogs = filteredBlogs.filter(blog => blog.title.toLowerCase().includes(blogTitle));
      }

      this.blogs = filteredBlogs;
      });
  }

  onCategorySelect(category: string): void {
    this.blogService.getBlogs().subscribe(data => {
      let blogs: Blog[] = data;

      if (category === this.allCategoryKey) {
        this.selectedCategory = this.allCategoryKey;
        this.blogs = blogs;
      } else {
        this.selectedCategory = category;
        this.blogs = blogs.filter(blog => blog.category === category);
      }
    });
  }
}
