const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Blog", async function () {
  
  it("Should return the new greeting once it's changed", async function () {
    const Blog = await ethers.getContractFactory("Blog");
    const blog = await Blog.deploy("My blog");
    await blog.deployed();
    expect(await blog.name()).to.equal("My blog");
  });

  it("Should create a post", async function () {
    const Blog = await ethers.getContractFactory("Blog");
    const blog = await Blog.deploy("My blog");
    await blog.deployed();
    await blog.createPost("My first post", "12345");
    
    const posts = await blog.fetchPosts()
    console.log('post 1:', posts[0])
    console.log('post title:', posts[0].title)
    console.log('hash:', posts[0].content)
  });

  it("Should edit a post", async function () {
    const Blog = await ethers.getContractFactory("Blog");
    const blog = await Blog.deploy("My blog");
    await blog.deployed();
    await blog.createPost("My Second post", "12345");
    
    let posts = await blog.fetchPosts()
    console.log('posts:', posts)
    await blog.updatePost(1, "My updated post", "23456", true)

    posts = await blog.fetchPosts()
    console.log('posts: ', posts)
    expect(posts[0].title).to.equal("My updated post")
  });

  it("Should add update the name", async function () {
    const Blog = await ethers.getContractFactory("Blog");
    const blog = await Blog.deploy("My blog");
    await blog.deployed();

    expect(await blog.name()).to.equal("My blog");
    await blog.updateName('My new blog')
    expect(await blog.name()).to.equal("My new blog");

    const name = await blog.name()
    console.log("Blog name: ", name)
  });
});
