import { Body, Delete, Get, HttpException, ParseIntPipe, Patch, Put, Query, Res } from "@nestjs/common";
import { UseGuards } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";
import { UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { Session } from "@nestjs/common";
import { Controller, Post } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import session from "express-session";
import { diskStorage, MulterError } from "multer";
import { ChatDTO } from "./Customer DTO/chat.DTO";
import { CustomerDTO, CustomerLoginDTO, CustomerUpdateDTO, CustomerUpdatePassDTO } from "./Customer DTO/customer.DTO";
import { CustomerService } from "./customer.service";
import { CustomerSessionGuard } from "./customerSession.guards";


@Controller('customer')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) { }


    /////////////////////////////////////// Customer Registration part start here ///////////////////////////////////

    //Customer Registration
    @Post('registration')
    @UseInterceptors(FileInterceptor('profile',
        {
            fileFilter: (req, file, cb) => {
                if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
                    cb(null, true);
                else {
                    cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
                }
            },
            limits: { fileSize: 300000 },
            storage: diskStorage({
                destination: './customerprofile',
                filename: function (req, file, cb) {
                    cb(null, Date.now() + file.originalname)
                },
            })
        }
    ))
    @UsePipes(new ValidationPipe)
    async customerRegistration(@Body() data: CustomerDTO, @UploadedFile() profileobj: Express.Multer.File) {
        const email = await this.customerService.checkEmail(data.email);
        if (email != null) {
            throw new HttpException('Email already exist', HttpStatus.BAD_REQUEST);
        }
        if (!profileobj) {
            throw new HttpException('Please select your profile picture', HttpStatus.BAD_REQUEST);
        }
        else {
            data.profilepic = profileobj.filename;
            return this.customerService.addCustomer(data);
        }
        
    }


    ///////////////////////////////////// Customer Registration part end here ////////////////////////////////////////////



    //////////////////////////////////// Customer Login part start here /////////////////////////////////////////////////

    //Customer Login
    @Post('login')
    @UsePipes(new ValidationPipe)
    async customerLogin(@Session() session, @Body() data: CustomerLoginDTO) {
        try {
            const login = await this.customerService.customerLogin(data);
            if (login != true) {
                throw new HttpException('Customer doesnt exist. ', HttpStatus.NOT_FOUND);
            }
            else {
                session.customer = data.email;
                console.log("Welcome " + session.customer);
                return ("Welcome " + session.customer);
            }
        }
        catch (error) {
            throw new HttpException('Email or Password is incorrect. ', HttpStatus.NOT_FOUND);
        }

    }


    /////////////////////////////////// Customer Login Part start here //////////////////////////////////////////////////


    /////////////////////////////////// Customer Profile part start here ////////////////////////////////////////////////

    //Show all Customers
    @Get('customers')
    async getAllCustomer() {
        return this.customerService.getAllCustomer();
    }


    //show profile
    @Get('profile')
    @UseGuards(CustomerSessionGuard)
    async getProfile(@Session() session) {
        return this.customerService.getCustomer(session.customer);
    }


    //Show Profile picture
    @Get('profilepic')
    @UseGuards(CustomerSessionGuard)
    async getImages(@Session() session, @Res() res): Promise<any> {
        const profile = await this.customerService.getCustomer(session.customer);
        res.sendFile(profile.profilepic, { root: './customerprofile' })
    }


    //Update profile data
    @Put('updateprofile')
    @UseGuards(CustomerSessionGuard)
    @UsePipes(new ValidationPipe())
    async updateProfile(@Session() session, @Body() data: CustomerUpdateDTO) {
        const profile = await this.customerService.getCustomer(session.customer);
        return this.customerService.updateCustomer(profile.id, data);
    }


    //Change password
    @Patch('changepass')
    @UseGuards(CustomerSessionGuard)
    @UsePipes(new ValidationPipe)
    async updatePass(@Session() session, @Body() data: CustomerUpdatePassDTO): Promise<any> {
        const profile = await this.customerService.getCustomer(session.customer);
        const oldpass = await this.customerService.verifyPassword(profile.id, data);
        if (oldpass == true) {
            if (data.new_password != data.confirm_password) {
                throw new HttpException('New Password and confirm Password doesnt match', HttpStatus.BAD_REQUEST);
            }
            if (data.old_password == data.new_password) {
                throw new HttpException('New Password and old Password cant be same', HttpStatus.BAD_REQUEST);
            }
            else {
                return this.customerService.changePassword(profile.id, data.confirm_password);
            }
        }
        else {
            throw new HttpException('Old Password doesnt match', HttpStatus.BAD_REQUEST);
        }

    }


    //delete mechanic profile
    @Delete("deleteprofile")
    @UseGuards(CustomerSessionGuard)
    async deleteCustomer(@Session() session) {
        const profile = await this.customerService.getCustomer(session.customer);
        return this.customerService.deleteCustomer(profile.id);
    }


    ///////////////////////////////// Customer Profile part end here ////////////////////////////////////////////////////


    /////////////////////////////////// Customer request for service part start ///////////////////////////////////////////

    //add customer service Request
    @Post('addrequest')
    @UseGuards(CustomerSessionGuard)
    async addServiceRequest(@Session() session, @Query() data: { mechanicid: number, serviceid: number }) {
        const profile = await this.customerService.getCustomer(session.customer);
        return this.customerService.addServiceRequest(profile.id, data);
    }


    @Get('showrequest')
    /*@UseGuards(CustomerSessionGuard)*/
    async getCustomerRequestService() {
        return this.customerService.getCustomerRequestService(); 
    }



    /////////////////////////////////// Customer request for service part end ///////////////////////////////////////////


    ///////////////////////////////// Customer Chat Part Start here /////////////////////////////////////////////////////

    //Customer Send Message
    @Post('sendmessage')
    @UseGuards(CustomerSessionGuard)
    @UsePipes(new ValidationPipe)
    async customerSendMessage(@Session() session, @Query('mechanicid', ParseIntPipe) mechanicid, @Body() message: ChatDTO) {
        const customer = await this.customerService.getCustomer(session.customer);
        const mechanic = await this.customerService.getMechanicById(mechanicid);
        if (!mechanic) {
            throw new HttpException('Mechanic not available', HttpStatus.NOT_FOUND);
        }
        return this.customerService.customerSendMessage(customer.id, mechanicid, message);
    }



    //Show messages by customer id
    @Get('showmessages')
    @UseGuards(CustomerSessionGuard)
    async showCustomerChat(@Session() session) {
        const customer = await this.customerService.getCustomer(session.customer);
        return await this.customerService.showCustomerChat(customer.id);
    }

    ///////////////////////////////// Customer Chat Part end here /////////////////////////////////////////////////////
}