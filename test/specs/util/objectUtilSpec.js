import {
  getFromObjectPath,
  getIntegerFromObjectPath,
  getArrayFromObjectPath,
  pluckNodeValue,
  isDefined,
  flatten
} from '../../../src/util/objectUtil'

describe('Object Util', function () {
  describe('getFromObjectPath', function () {
    it('fetches a value from inside the nested object', function () {
      var obj = {
        foo: {
          bar: {
            minky: 'binky'
          }
        }
      }

      var result = getFromObjectPath(obj, 'foo.bar.minky')

      expect(result).to.deep.equal(obj.foo.bar.minky)
    })

    it('fetches a value from inside the nested object which is falsy', function () {
      var obj = {
        foo: {
          bar: {
            falsy: 0
          }
        }
      }

      var result = getFromObjectPath(obj, 'foo.bar.falsy')

      expect(result).to.deep.equal(obj.foo.bar.falsy)
    })

    it('returns the supplied argument if the object has no properties', function () {
      var obj = {}

      var result = getFromObjectPath(obj, 'foo.does.not.exist', 'it\'s missing!')

      expect(result).to.deep.equal('it\'s missing!')
    })

    it('returns the supplied argument if the path inside the nested objects does not exist', function () {
      var obj = {
        foo: {}
      }

      var result = getFromObjectPath(obj, 'foo.does.not.exist', 'it\'s missing!')

      expect(result).to.deep.equal('it\'s missing!')
    })
  })

  describe('getIntegerFromObjectPath', function () {
    it('fetches a value from inside the nested object and converts it to an integer', function () {
      var obj = {
        foo: {
          bar: {
            number: '123'
          }
        }
      }

      var result = getIntegerFromObjectPath(obj, 'foo.bar.number')

      expect(result).to.equal(123)
    })

    it('fetches a value from inside the nested object and converts it to an integer', function () {
      var obj = {
        foo: {
          bar: {
            string: 'abc'
          }
        }
      }

      var result = getIntegerFromObjectPath(obj, 'foo.bar.string')

      expect(result).to.be.undefined
    })

    it('returns default value when it fails to convert returned value to integer', function () {
      var defaultValue = 789

      var obj = {
        foo: {
          bar: {
            string: 'abc'
          }
        }
      }

      var result = getIntegerFromObjectPath(obj, 'foo.bar.string', defaultValue)

      expect(result).to.equal(defaultValue)
    })
  })

  describe('getArrayFromObjectPath', function () {
    it('extracts arrays from inside a nested object', function () {
      var obj = {
        foo: {
          bar: {
            minky: ['binky']
          }
        }
      }

      var result = getArrayFromObjectPath(obj, 'foo.bar.minky')

      expect(result).to.deep.equal(obj.foo.bar.minky)
    })

    it('returns an empty array if the path inside the nested objects does not exist', function () {
      var obj = {

      }

      var result = getArrayFromObjectPath(obj, 'foo.does.not.exist')

      expect(result).to.deep.equal([])
    })

    it('returns an empty array if only some of path inside the nested objects does not exist', function () {
      var obj = {
        foo: {
        }
      }

      var result = getArrayFromObjectPath(obj, 'foo.does.not.exist')

      expect(result).to.deep.equal([])
    })

    it('returns an empty array if object is an array', function () {
      var obj = []

      var result = getArrayFromObjectPath(obj, 'foo.does.not.exist')

      expect(result).to.deep.equal([])
    })

    it('returns an empty array if object is null', function () {
      var obj = null

      var result = getArrayFromObjectPath(obj, 'foo.does.not.exist')

      expect(result).to.deep.equal([])
    })

    it('returns an empty array if object is undefined', function () {
      var result = getArrayFromObjectPath(undefined, 'foo.does.not.exist')

      expect(result).to.deep.equal([])
    })

    it('extracts multiple values from the same object in an array', function () {
      var obj = {
        foo: {
          bar: [
            {
              minky: ['binky']
            },
            {
              minky: ['stinky']
            }
          ]
        }
      }

      var result = getArrayFromObjectPath(obj, 'foo.bar.minky')

      expect(result).to.deep.equal(['binky', 'stinky'])
    })

    it('extracts multiple values from the same object when the lead object is an array', function () {
      var array = [
        {
          foo: {
            bar: [
              {
                minky: ['binky']
              },
              {
                minky: ['stinky']
              }
            ]
          }
        }
      ]

      var result = getArrayFromObjectPath(array, 'foo.bar.minky')

      expect(result).to.deep.equal(['binky', 'stinky'])
    })

    it('extracts multiple values from the same object in an array, ignoring non matching objects', function () {
      var obj = {
        foo: {
          bar: [
            {
              minky: {
                name: 'binky'
              }
            },
            {
              nonMatching: {
                name: 'linky'
              }
            },
            {
              minky: {
                name: 'stinky'
              }
            }
          ]
        }
      }

      var result = getArrayFromObjectPath(obj, 'foo.bar.minky.name')

      expect(result).to.deep.equal(['binky', 'stinky'])
    })

    it('extracts multiple values from the same object in an array, ignoring non matching objects containing arrays', function () {
      var obj = {
        foo: {
          bar: [
            {
              minky: [
                {
                  name: 'binky'
                },
                {
                  name: 'inky'
                }
              ]
            },
            {
              nonMatching: [
                {
                  name: 'bob'
                },
                {
                  name: 'sue'
                }
              ]
            },
            {
              minky: [
                {
                  name: 'stinky'
                },
                {
                  name: 'linky'
                }
              ]
            }
          ]
        }
      }

      var result = getArrayFromObjectPath(obj, 'foo.bar.minky.name')

      expect(result).to.deep.equal(['binky', 'inky', 'stinky', 'linky'])
    })

    it('extracts multiple values from the same object in an array, ignoring non matching objects containing arrays', function () {
      var obj = {
        foo: [
          {
            bar: [
              {
                minky: [
                  {
                    name: 'binky'
                  },
                  {
                    name: 'inky'
                  }
                ]
              },
              {
                nonMatching: [
                  {
                    name: 'bob'
                  },
                  {
                    name: 'sue'
                  }
                ]
              },
              {
                minky: [
                  {
                    name: 'stinky'
                  },
                  {
                    name: 'linky'
                  }
                ]
              }
            ]
          },
          {
            baz: [
              {
                minky: [
                  {
                    name: 'pinky'
                  },
                  {
                    name: 'tinky'
                  }
                ]
              },
              {
                nonMatching: [
                  {
                    name: 'bob'
                  },
                  {
                    name: 'sue'
                  }
                ]
              }
            ]
          }
        ]
      }

      var result = getArrayFromObjectPath(obj, 'foo.bar.minky.name')

      expect(result).to.deep.equal(['binky', 'inky', 'stinky', 'linky'])
    })
  })

  describe('pluckNodeValue', function () {
    it('returns node value from object', function () {
      var expectedValue = 'I am a value'

      var obj = {
        nodeValue: expectedValue
      }

      var result = pluckNodeValue(obj)

      expect(result).to.equal(expectedValue)
    })

    it('returns undefined if no nodevalue on object', function () {
      var obj = {}

      var result = pluckNodeValue(obj)

      expect(result).to.be.undefined
    })

    it('returns undefined if object is undefined', function () {
      var result = pluckNodeValue(undefined)

      expect(result).to.be.undefined
    })
  })

  describe('isDefined', function () {
    it('should return true if defined', function () {
      var result = isDefined('working')

      expect(result).to.be.true
    })

    it('should return false if not defined', function () {
      var result = isDefined(undefined)

      expect(result).to.be.false
    })

    it('should return false if not defined', function () {
      var result = isDefined(null)

      expect(result).to.be.false
    })
  })

  describe('flatten', function () {
    it('should flatten two arrays into one', function () {
      var arrays = [
        ['binky'],
        ['inky']
      ]

      expect(flatten(arrays)).to.deep.equal(['binky', 'inky'])
    })

    it('should flatten two arrays into one when one is empty', function () {
      var arrays = [
        [],
        ['inky']
      ]

      expect(flatten(arrays)).to.deep.equal(['inky'])
    })

    it('should return array when single array passed', function () {
      var arrays = [
        'binky',
        'inky'
      ]

      expect(flatten(arrays)).to.deep.equal(['binky', 'inky'])
    })
  })
})
