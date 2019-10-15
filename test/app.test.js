const supertest = require('supertest');
const app = require('../app');
const { expect } = require('chai');
const apps = require('../playstore.js');

describe('GET /apps', () => {
    it('should return all the apps', () => {
        return supertest(app)
            .get('/apps')
            .then(res => {
                expect(res.body).to.eql(apps);
            });
    });

    it('invalid sort', () => {
        return supertest(app)
            .get('/apps')
            .query({ 'sort' : 'MISTAKE' })
            .expect(400, 'Can only sort by rating or app');
    });

    it('invalid sort, valid genre', () => {
        return supertest(app)
            .get('/apps')
            .query({ 'sort' : 'MISTAKE' , 'genres' : 'Action' })
            .expect(400, 'Can only sort by rating or app');
    });
       
    it('invalid genre', () => {
        return supertest(app)
            .get('/apps')
            .query({ 'genres' : 'MISTAKE' })
            .expect(400, 'Can only filter by Action, Puzzle, Strategy, Casual, Arcade, or Card');
    });

    it('valid sort, invalid genre', () => {
        return supertest(app)
            .get('/apps')
            .query({ 'sort' : 'app' , 'genres' : 'MISTAKE' })
            .expect(400, 'Can only filter by Action, Puzzle, Strategy, Casual, Arcade, or Card');
    });

    it('valid sort', () => {
        return supertest(app)
            .get('/apps')
            .query({ 'sort' : 'app' })
            .then(res => {
                expect(res.body).to.be.an('array');
                let i = 0;
                let sorted = true;
                while(sorted && i < res.body.length - 1) {
                    sorted = sorted && res.body[i].App < res.body[i + 1].App;
                    i++;
                }
                expect(sorted).to.be.true;
            });
    });

    it('valid sort', () => {
        return supertest(app)
            .get('/apps')
            .query({ 'sort' : 'rating' })
            .then(res => {
                expect(res.body).to.be.an('array');
                let i = 0;
                let sorted = true;
                while(sorted && i+1 < res.body.length - 1) {
                    sorted = sorted && res.body[i].Rating >= res.body[i + 1].Rating;
                    i++;
                }
                expect(sorted).to.be.true;
            });
    });

    it('filter by genre', () => {
        return supertest(app)
            .get('/apps')
            .query({ 'genres' : 'Action' })
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf(6);
            });
    });

    it('sort by app name and filter by action', () => {
        return supertest(app)
            .get('/apps')
            .query({ 'sort' : 'app', 'genres' : 'Action' })
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf(6);
                let i = 0;
                let sorted = true;
                while(sorted && i < res.body.length -1) {
                    sorted = sorted && res.body[i].App < res.body[i + 1].App;
                    i++;
                }
                expect(sorted).to.be.true;
            });
    });
    
});