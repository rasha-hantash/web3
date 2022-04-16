const Inbox = artifacts.require('Inbox.sol')

contract('Inbox', async () => {
    it('Should get message', async ()=> {
        const inbox = await Inbox.new('Hello, World')
        const message = await inbox.getMessage();
        assert(message.toString() === "Hello, World");
    })
    
    it('Should set message', async ()=> {
        const inbox = await Inbox.new("Hello, World")
        await inbox.setMessage('Goodbye, World');
        const message = await inbox.getMessage()
        assert(message.toString() === 'Goodbye, World');
    })
})