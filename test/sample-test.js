const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", async function () {
  
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
    console.log('posts:', posts)

    console.log('post 1:', posts[0])
    console.log('post title:', posts[0].title)
    console.log('first entry:', posts[0].items[0].toString())
  });

  it("Should add a post", async function () {
    const Blog = await ethers.getContractFactory("Blog");
    const blog = await Blog.deploy("My blog");
    await blog.deployed();

    await blog.createPost("My Second post", "12345");
    
    let posts = await blog.fetchPosts()
    console.log('post ID:', posts[0].id.toNumber())

    await blog.addPost(1, "23456")

    posts = await blog.fetchPosts()
    console.log('post items:', posts[0].items)
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
