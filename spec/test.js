// Using constants below to test xml-rpc specification

const simpleSpec = {
  methodCall: [
    { methodName: 'SimpleMethod' },
    {
      params: [
        { param: [{ value: [{ string: 'Hello, World' }] }] },
        { param: [{ value: [{ string: 'Hello, World' }] }] }
      ]
    }
  ]
};

const arraySpec = {
  methodCall: [
    { methodName: 'ArrayMethod' },
    {
      params: [
        {
          param: [
            {
              value: [
                {
                  array: [
                    {
                      data: [
                        { value: [{ string: 'hello' }] },
                        { value: [{ int: 123 }] }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

var structSpec = {
  methodCall: [
    { methodName: 'StructMethod' },
    {
      params: [
        {
          param: [
            {
              value: [
                {
                  struct: [
                    {
                      member: [
                        { name: 'structName', value: [{ string: 'hey' }] }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          param: [
            {
              value: [
                {
                  struct: [
                    {
                      member: [
                        { name: 'structName', value: [{ string: 'hey' }] }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
